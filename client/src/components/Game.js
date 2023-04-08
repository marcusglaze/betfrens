import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { gamesSelector } from '../store/selectors'

import GameEntry from './GameEntry'

const Game = () => {
    const { gameId } = useParams()

    const games = useSelector(gamesSelector)
    const game = games.filter((game) => game.gameId === gameId)[0]

    console.log(game)

    return (
        <GameEntry game={game} index={0} showAllBets={true} />
    )
}

export default Game
