import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { 
    gamesSelector,
    myActiveBetsSelector, 
    mySettledBetsSelector 
} from '../store/selectors'

import BetTable from './BetTable'

const MyBets = () => {

    const account = useSelector(state => state.provider.account)
    
    const games = useSelector(gamesSelector)
    const activeBets = useSelector(myActiveBetsSelector)
    const settledBets = useSelector(mySettledBetsSelector)

    const [activeBtn, setActiveBtn] = useState(0)

    const activeBtnStyle = 'py-3 px-10 bg-blue-500 text-white font-bold'
    const notActiveBtnStyle = 'py-3 px-10 bg-gray-200 hover:bg-gray-300'
    
    if (!account) {
        return <div>Connect wallet</div>
    }

    return (
        <div>
            <div className='flex flex-row w-full justify-center mt-2'>
                <button 
                    onClick={() => setActiveBtn(0)}
                    className={activeBtn === 0 ? activeBtnStyle : notActiveBtnStyle}
                >
                    Active
                </button>
                <button 
                    onClick={() => setActiveBtn(1)}
                    className={activeBtn === 1 ? activeBtnStyle : notActiveBtnStyle}
                >
                    Settled
                </button>
            </div>
            
            <div className='mt-5'>
            {activeBtn === 0 ? (
                <BetTable bets={activeBets} games={games} showMyBets={true}/>
            ) : (
                <BetTable bets={settledBets} games={games} showMyBets={true}/>
            )}
            </div>
        </div>
    )
}

export default MyBets
