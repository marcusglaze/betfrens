export const provider = (state = {}, action) => {
    switch (action.type) {
        case 'PROVIDER_LOADED':
            return {
                ...state,
                connection: action.connection
            }
        case 'NETWORK_LOADED':
            return {
                ...state,
                chainId: action.chainId
            }
        case 'ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account
            }
        case 'BALANCE_LOADED':
            return {
                ...state,
                balance: action.balance
            }
        default:
            return state
    }
}

const DEFAULT_CONTRACT_STATE = {
    loaded: false,
    contract: {},
    allGames: [],
    events: []
}
export const contract = (state = DEFAULT_CONTRACT_STATE, action) => {
    switch (action.type) {
        case 'CONTRACT_LOADED':
            return {
                ...state,
                loaded: true,
                contract: action.contract
            }
        case 'ALL_GAMES_LOADED':
            return {
                ...state,
                allGames: action.games
            }
        case 'GAME_CREATES_LOADED':
            return {
                ...state,
                gameCreates: action.gameCreates
            }
        case 'GAME_RESOLVES_LOADED':
            return {
                ...state,
                gameResolves: action.gameResolves
            }
        case 'ALL_BETS_LOADED':
            return {
                ...state,
                allBets: action.bets
            }
        case 'ACCEPTED_BETS_LOADED':
            return {
                ...state,
                acceptedBets: action.acceptedBets
            }
        case 'CANCELLED_BETS_LOADED':
            return {
                ...state,
                cancelledBets: action.cancelledBets
            }
        case 'SETTLED_BETS_LOADED':
            return {
                ...state,
                settledBets: action.settledBets
            }
        default:
            return state;
    }
}
