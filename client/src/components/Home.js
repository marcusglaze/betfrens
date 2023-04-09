import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'

import { gamesSelector } from '../store/selectors'

import CategoryBar from './CategoryBar'
import GameEntry from './GameEntry'

const Home = () => {

    //const ethereumPrice = useSelector(store => store.connector.price);
    const games = useSelector(gamesSelector)

    const [activeGames, setActiveGames] = useState(null);

    const setActiveSport = (sportId) => {
        if (sportId === 0) {
            setActiveGames(games)
        } else {
            const active = games.filter((g) => g.sportId === sportId)
            setActiveGames(active)
        }
    }
    
    useEffect(() => { 
        // set default to show all games
        setActiveGames(games)
    }, [])

    if (activeGames === null) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <CategoryBar handleSelect={setActiveSport}/>
            
            <InfiniteScroll
                dataLength={activeGames.length}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p>Bottom of list</p>
                }
                className='grid grid-cols-1 ml-4 mt-2 w-[29rem] gap-4 md:grid-cols-2 md:w-[64rem] xl:grid-cols-3 xl:w-[92rem]'
            >
                {activeGames.map((game, index) => {
                    return (
                        <GameEntry game={game} index={index} key={index} showAllBets={false} />
                    )
                })}
            </InfiniteScroll>
        </div>
    )
}

export default Home
