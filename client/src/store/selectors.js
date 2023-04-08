import { ethers } from 'ethers';
import { createSelector } from "reselect";
import { get, reject } from "lodash";
import moment from "moment/moment";

const account = state => get(state, 'provider.account')

const gameCreates = state => get(state, 'contract.gameCreates', []);
const gameResolves = state => get(state, 'contract.gameResolves', []);
const allBets = state => get(state, 'contract.allBets', []);
const acceptedBets = state => get(state, 'contract.acceptedBets', []);
const cancelledBets = state => get(state, 'contract.cancelledBets', []);
const settledBets = state => get(state, 'contract.settledBets', []);

const mergeBets = (active, accepted, settled) => {
    return (
        active.map((activeBet) => {
            const acceptedBet = accepted.filter((ab) => ab.betId.toString() === activeBet.betId.toString())[0];
            const settledBet = settled.filter((fb) => fb.betId.toString() === activeBet.betId.toString())[0];

            const notAccepted = typeof acceptedBet === 'undefined';
            const notSettled = typeof settledBet === 'undefined';

            const acceptor = acceptedBet?.acceptor;
            const acceptorTeam = acceptedBet?.acceptorTeam;
            const acceptorAmount = acceptedBet?.acceptorAmount;
            const acceptedTimestamp = parseInt(acceptedBet?.acceptedTimestamp)

            const winner = settledBet?.winner;
            const winningTeam = settledBet?.winningTeam;
            const winAmount = settledBet?.winAmount;
            const feesPaid = settledBet?.feesPaid;
            const settledTimestamp = parseInt(settledBet?.settledTimestamp)

            const bet = {
                betId: parseInt(activeBet.betId),
                gameId: activeBet.gameId,
                creator: activeBet.creator,
                creatorTeam: activeBet.creatorTeam,
                creatorAmount: activeBet.creatorAmount,
                placedTimestamp: parseInt(activeBet.createdTimestamp),
                acceptor,
                acceptorTeam,
                acceptorAmount,
                acceptedTimestamp,
                winner,
                winningTeam,
                winAmount,
                feesPaid,
                settledTimestamp,
                isAccepted: !notAccepted,
                isSettled: !notSettled
            }
            return (bet);
        })
    )
}

const validBets = state => {
    const all = allBets(state);
    const cancelled = cancelledBets(state);
    const accepted = acceptedBets(state);
    const settled = settledBets(state);

    const validBets = reject(all, (bet) => {
        const betCancelled = cancelled.some((b) => b.betId.toString() === bet.betId.toString());
        return betCancelled;
    })

    const bets = mergeBets(validBets, accepted, settled);

    return bets;
}

const activeBets = state => {
    const all = allBets(state);
    const cancelled = cancelledBets(state);
    const accepted = acceptedBets(state);
    const settled = settledBets(state);

    const activeBets = reject(all, (bet) => {
        const betSettled = settled.some((b) => b.betId.toString() === bet.betId.toString());
        const betCancelled = cancelled.some((b) => b.betId.toString() === bet.betId.toString());
        return (betSettled || betCancelled)
    })

    const bets = mergeBets(activeBets, accepted, settled);

    return bets;
}

const mergedSettledBets = state => {
    const all = allBets(state);
    const cancelled = cancelledBets(state);
    const accepted = acceptedBets(state);
    const settled = settledBets(state);

    const validBets = reject(all, (bet) => {
        const betCancelled = cancelled.some((b) => b.betId.toString() === bet.betId.toString());
        return betCancelled;
    })

    const bets = mergeBets(validBets, accepted, settled);

    const sb = reject(bets, (bet) => {
        if (!bet.isSettled) {
            return bet;
        }
    })

    return sb;
}

const getStatusText = (id) => {
    switch (id)
    {
        case 1:
            return 'CANCELED';
        case 2:
            return 'DELAYED';
        case 3:
            return 'END OF FIGHT';
        case 4:
            return 'END OF ROUND';
        case 5: 
            return 'END PERIOD';
        case 6:
            return 'FIGHTERS INTRODUCTION';
        case 7:
            return 'FIGHTERS WALKING';
        case 8:
            return 'FINAL';
        case 9:
            return 'FINAL PEN';
        case 10:
            return 'FIRST HALF';
        case 11:
            return 'FULL TIME';
        case 12:
            return 'HALFTIME';
        case 13:
            return 'IN PROGRESS';
        case 14:
            return 'IN PROGRESS';
        case 15:
            return 'POSTPONED';
        case 16:
            return 'PRE FIGHT';
        case 17:
            return 'RAIN DELAY';
        case 18:
            return 'SCHEDULED';
        case 19:
            return 'SECOND HALF';
        case 20:
            return 'TBD';
        case 21:
            return 'UNCONTESTED';
        case 22:
            return 'ABANDONED';
        case 23: 
            return 'END OF EXTRATIME';
        case 24:
            return 'END OF REGULATION';
        case 25:
            return 'FORFEIT';
        case 26:
            return 'HALFTIME ET';
        case 27:
            return 'OVERTIME';
        case 28:
            return 'SHOOTOUT';
        default:
            return '';

    }
}

//======================================================

// UPCOMING GAMES SELECTOR

const decorateGame = (gameCreate, gameResolve) => {

    const noGameResolve = typeof gameResolve === 'undefined'
    
    // get elements of the request objects
    const gameId = gameCreate.gameId
    const startTime = parseInt(gameCreate.startTime)
    const homeTeam = gameCreate.homeTeam
    const awayTeam = gameCreate.awayTeam
    const sportId = parseInt(gameCreate.sportId)

    const homeScore = noGameResolve ? 0 : parseInt(gameResolve.homeScore)
    const awayScore = noGameResolve ? 0 : parseInt(gameResolve.awayScore)
    const statusId = noGameResolve ? 0 : parseInt(gameResolve.statusId)

    // format timestamp for display -- "[DAY OF WEEK] [TIME][AM/PM] [TIMEZONE]"
    const utcTimestamp = moment.utc(startTime*1000).local()
    const now = moment();

    let formattedTimestamp
    const oneWeekFromNow = moment().add(7, 'days')

    if (utcTimestamp.day() === now.day()) {
        formattedTimestamp = utcTimestamp.format('h:mmA z')
    } else if (utcTimestamp.isBetween(now, oneWeekFromNow, null, '[]')) {
        formattedTimestamp = utcTimestamp.format('ddd h:mmA z')
    } else {
        formattedTimestamp = utcTimestamp.format('MMM D h:mmA z')
    }

    // determine if game is currently in progress or finished
    const currentTimestamp = Math.floor((new Date()).getTime() / 1000)
    const isLive = currentTimestamp > startTime && statusId !== 8 ? true : false
    const isFinal = statusId === 8 ? true : false

    // use status id to return status message
    const status = getStatusText(statusId)

    return ({
        gameId,
        startTime,
        sportId,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        statusId,
        formattedTimestamp,
        isLive,
        isFinal,
        status
    })
}

const decorateGames = (gameCreates, gameResolves) => {
    return (
        gameCreates.map((gameCreate) => {
            const gameResolve = gameResolves.filter(gr => gr.gameId === gameCreate.gameId).pop();
            const game = decorateGame(gameCreate, gameResolve);
            return(game);
        })
    )
}

export const gamesSelector = createSelector(
    gameCreates,
    gameResolves, 
    (gameCreates, gameResolves) => {
        // show games that are occurring in the next 48 hours
        const date = new Date();
        const startOfToday = parseInt(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime())/1000;
        const endOfTomorrow = parseInt(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 23, 59, 59, 999).getTime())/1000;

        // filter games by date
        //gameCreates = gameCreates.filter((g) => g.startTime > startOfToday && g.startTime < endOfTomorrow);

        // check for duplicates and remove
        let seen = new Set();
        gameCreates = gameCreates.filter((g) => !seen.has(g.gameId) && seen.add(g.gameId));

        // decorate games
        let Games = decorateGames(gameCreates, gameResolves);

        // sort by timestamp
        Games = Games.sort((a, b) => a.startTime - b.startTime);

        return Games;
    }
)

//======================================================

// My Active Bets

const decorateBet = (bet, account) => {

    let myTeam, amount, formattedAmount, timestamp
    let createdByMe = false
    let acceptedByMe = false
    if (bet.creator.toUpperCase() === account) {
        myTeam = bet.creatorTeam
        amount = bet.creatorAmount
        formattedAmount = ethers.formatEther(amount)
        timestamp = parseInt(bet.placedTimestamp)
        createdByMe = true
    } else if (bet.acceptor?.toUpperCase() === account) {
        myTeam = bet.acceptorTeam
        amount = bet.acceptorAmount
        formattedAmount = ethers.formatEther(amount)
        timestamp = parseInt(bet.acceptedTimestamp)
        acceptedByMe = true
    }

    let wonByMe = false
    if (bet.winner?.toUpperCase() === account) {
        wonByMe = true
    }

    // format timestamp for display -- "[DAY OF WEEK] [TIME][AM/PM] [TIMEZONE]"
    const utcTimestamp = moment.utc(timestamp*1000).local();

    const formattedTimestamp = !acceptedByMe ? (
        `PLACED: ${utcTimestamp.format("M/D/YYYY h:mmA z").toUpperCase()}`
    ) : (
        `ACCEPTED: ${utcTimestamp.format("M/D/YYYY h:mmA z").toUpperCase()}`
    );

    const status = bet.isSettled ? 'SETTLED' : bet.isAccepted ? 'ACTIVE' : 'NOT ACCEPTED';
    const statusColor = status === 'SETTLED' ? 'font-bold' : status === 'ACTIVE' ? 'text-green-500 font-bold' : 'text-yellow-500 font-bold';

    const formattedCreatorAmount = ethers.formatEther(bet.creatorAmount)

    let formattedAcceptorAmount = 0;
    if (bet.isAccepted) {
        formattedAcceptorAmount = ethers.formatEther(bet.acceptorAmount)
    }

    let formattedWinAmount = 0;
    let formattedFeesPaid = 0;
    if (bet.isSettled) {
        formattedWinAmount = ethers.formatEther(bet.winAmount)
        formattedFeesPaid = ethers.formatEther(bet.feesPaid)
    }

    // format timestamp for display -- "[DAY OF WEEK] [TIME][AM/PM] [TIMEZONE]"
    const utcPlacedTimestamp = moment.utc(parseInt(bet.placedTimestamp)*1000).local();
    const utcAcceptedTimestamp = moment.utc(parseInt(bet.acceptedTimestamp)*1000).local();
    const utcSettledTimestamp = moment.utc(parseInt(bet.settledTimestamp)*1000).local();
    const formattedPlacedTimestamp = `${utcPlacedTimestamp.format("M/D/YYYY h:mmA z").toUpperCase()}`;
    const formattedAcceptedTimestamp = `${utcAcceptedTimestamp.format("M/D/YYYY h:mmA z").toUpperCase()}`;
    const formattedSettledTimestamp = `${utcSettledTimestamp.format("M/D/YYYY h:mmA z").toUpperCase()}`;


    // add this to smart contract 
    // bet type: 0=moneyline, 1=handicap, 2=over 3=under
    const type = 'moneyline'

    return ({
        ...bet,
        createdByMe,
        acceptedByMe,
        myTeam,
        formattedAmount: parseFloat(formattedAmount).toFixed(4),
        formattedCreatorAmount: parseFloat(formattedCreatorAmount).toFixed(4),
        formattedAcceptorAmount: parseFloat(formattedAcceptorAmount).toFixed(4),
        formattedWinAmount: parseFloat(formattedWinAmount).toFixed(4),
        formattedFeesPaid: parseFloat(formattedFeesPaid).toFixed(4),
        status,
        statusColor,
        formattedTimestamp,
        formattedPlacedTimestamp,
        formattedAcceptedTimestamp,
        formattedSettledTimestamp,
        wonByMe,
        type
    })
}

const decorateBets = (bets, account) => {
    return (
        bets.map((bet) => {
            bet = decorateBet(bet, account);
            return(bet);
        })
    )
}

export const allBetsSelector = createSelector(
    validBets,
    account, 
    (allBets, account) => {
        // get user account
        const accountUppercase = account?.toUpperCase()

        // decorate bets
        allBets = decorateBets(allBets, accountUppercase)

        // sort by timestamp
        allBets = allBets.sort((a, b) => b.betId - a.betId)

        return allBets
    }
)

export const myActiveBetsSelector = createSelector(
    activeBets,
    account, 
    (activeBets, account) => {
        if (!account) {
            return activeBets
        }
        // get user account
        const accountUppercase = account?.toUpperCase();

        // filter bets by account
        activeBets = activeBets.filter((b) => b.creator.toUpperCase() === accountUppercase || b.acceptor?.toUpperCase() === accountUppercase);

        // decorate bets
        activeBets = decorateBets(activeBets, accountUppercase);

        // sort by timestamp
        activeBets = activeBets.sort((a, b) => b.betId - a.betId);

        return activeBets;
    }
)

export const mySettledBetsSelector = createSelector(
    mergedSettledBets,
    account,
    (settledBets, account) => {
        if (!account) {
            return settledBets
        }
        // get user account
        const accountUppercase = account?.toUpperCase();

        // filter bets by game id
        settledBets = settledBets.filter((b) => b.creator.toUpperCase() === accountUppercase || b.acceptor.toUpperCase() === accountUppercase);

        // decorate bets
        let bets = decorateBets(settledBets, accountUppercase);

        // sort by timestamp
        bets = bets.sort((a, b) => b.betId - a.betId);

        return bets;
    }
)

export const gameBetsSelector = (gameId) => createSelector(
    validBets,
    account,
    (validBets, account) => {
        if (!account) {
            return validBets
        }
        // filter bets by game id
        validBets = validBets.filter((b) => b.gameId === gameId);

        // get user account
        const accountUppercase = account?.toUpperCase();

        // decorate bets
        let gameBets = decorateBets(validBets, accountUppercase);

        // sort by timestamp
        gameBets = gameBets.sort((a, b) => b.betId - a.betId);

        return gameBets;
    }
)
