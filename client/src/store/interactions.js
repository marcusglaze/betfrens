import { ethers } from 'ethers'

import abi from '../abis/PeerDuel.json';

export const loadProvider = (dispatch) => {
    const connection = new ethers.BrowserProvider(window.ethereum)
    dispatch({ type: 'PROVIDER_LOADED', connection })
    return connection
}

export const loadNetwork = async (provider, dispatch) => {
    const chainId = await provider.getNetwork()
    dispatch({ type: 'NETWORK_LOADED', chainId })
    return chainId
}

export const loadAccount = async (provider, dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.getAddress(accounts[0])
    dispatch({ type: 'ACCOUNT_LOADED', account })
    let balance = await provider.getBalance(account)
    dispatch({ type: 'BALANCE_LOADED', balance })
    return account
}

export const loadContract = async (provider, address, dispatch) => {
    const contract = new ethers.Contract(address, abi.abi, provider)
    dispatch({ type: 'CONTRACT_LOADED', contract })
    return contract
}

export const subscribeToEvents = (contract, dispatch) => {
    contract.on('Create', (betId, creator, creatorTeam, creatorAmount, timestamp, event) => {
        dispatch({type: 'PLACE_BET_SUCCESS', event});
    })
    contract.on('Accept', (betId, acceptor, acceptorTeam, acceptorAmount, timestamp, event) => {
        dispatch({type: 'PLACE_BET_SUCCESS', event});
    })
    contract.on('Cancel', (betId, creator, transferredAmount, timestamp, event) => {
        dispatch({type: 'CANCEL_BET_SUCCESS', event});
    })
    contract.on('RequestCreate', (gameId, sportId, startTime, homeTeam, awayTeam, timestamp, event) => {
        dispatch({type: 'GAME_CREATE_SUCCESS', event});
    })
    contract.on('RequestResolve', (gameId, sportId, homeScore, awayScore, statusId, timestamp, event) => {
        dispatch({type: 'GAME_RESOLVE_SUCESS', event});
    })
}

export const loadGames = async (provider, contract, dispatch) => {
  const block = await provider.getBlockNumber();
  // Fetch GameCreate
  const createStream = await contract.queryFilter('RequestCreate', 0, block);
  const gameCreates = createStream.map(event => event.args);
  dispatch({type: 'GAME_CREATES_LOADED', gameCreates});
  // Fetch GameResolve
  const resolveStream = await contract.queryFilter('RequestResolve', 0, block);
  const gameResolves = resolveStream.map(event => event.args);
  dispatch({type: 'GAME_RESOLVES_LOADED', gameResolves});
}

export const loadBets = async (provider, contract, dispatch) => {
  const block = await provider.getBlockNumber();
  // Fetch all bets
  const createStream = await contract.queryFilter('Create', 0, block);
  const bets = createStream.map(event => event.args);
  dispatch({type: 'ALL_BETS_LOADED', bets});
  // Fetch accepted bets
  const acceptedStream = await contract.queryFilter('Accept', 0, block);
  const acceptedBets = acceptedStream.map(event => event.args);
  dispatch({type: 'ACCEPTED_BETS_LOADED', acceptedBets});
  // Fetch settled bets
  const settledStream = await contract.queryFilter('Settle', 0, block);
  const settledBets = settledStream.map(event => event.args);
  dispatch({type: 'SETTLED_BETS_LOADED', settledBets});
  // Fetch cancelled bets
  const cancelStream = await contract.queryFilter('Cancel', 0, block);
  const cancelledBets = cancelStream.map(event => event.args);
  dispatch({type: 'CANCELLED_BETS_LOADED', cancelledBets});
}

export const makeBet = async (provider, contract, type, gameId, betId, team, amount, dispatch) => {
    const signer = provider.getSigner();
    let transaction;
    const formatAmount = ethers.parseEther(amount.toString());
    const gameIdBytes32 = ethers.hexlify(gameId);
    dispatch({type: 'PLACE_BET_REQUEST'});
    try {
        if (type === 'Create') {
            transaction = await contract.connect(signer).createBet(
                gameIdBytes32, 
                team, 
                formatAmount, 
                { value: formatAmount }
            );
            await transaction.wait();
        } else {
            transaction = await contract.connect(signer).acceptBet(
                betId,
                team,
                { value: amount }
            );
            await transaction.wait();
        }
    } catch (error) {
        console.log(error);
        dispatch({type: 'PLACE_BET_FAIL'});
    }
}

export const cancelBet = async (provider, contract, betId, dispatch) => {
    const signer = provider.getSigner();
    dispatch({type: 'CANCEL_BET_REQUEST'});
    try {
        const transaction = await contract.connect(signer).cancelBet(betId);
        await transaction.wait();
    } catch (error) {
        console.log(error);
        dispatch({type: 'CANCEL_BET_FAIL'});
    }
}
