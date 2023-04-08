import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
    gamesSelector,
    allBetsSelector
} from '../store/selectors'

import BetTable from './BetTable'

const AllBets = () => {
    
    const games = useSelector(gamesSelector)
    const activeBets = useSelector(allBetsSelector)

    return (
        <div>   
            {activeBets.length > 0 && (
                <div className='mt-5'>
                    <BetTable bets={activeBets} games={games} showMyBets={false}/>
                </div>
            )}  
        </div>
    )
}

export default AllBets
