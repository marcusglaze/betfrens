import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Blockies from 'react-blockies'

import TeamLogo from './TeamLogo'
import config from '../config.json'
import { MdHandshake } from 'react-icons/md'

const BetTable = ({ bets, games, showMyBets }) => {

    const { chainId } = useSelector(state => state.provider.chainId)

    const [json, setJson] = useState(null)

    const createJsonData = (bets, games) => {
        const jsonArray = bets.map((bet) => {
            const game = games.filter((game) => game?.gameId === bet?.gameId)[0]
            const placedTime = bet?.createdByMe ? ( bet?.formattedPlacedTimestamp ) : ( bet?.formattedAcceptedTimestamp )
            let sport
            if (game?.sportId === 4) { sport = "NBA" }
            let dataObj = {
                "Placed"  : placedTime,
                "Kickoff" : game?.formattedTimestamp,
                "AwayTeam" : game?.awayTeam,
                "HomeTeam" : game?.homeTeam,
                "Sport" : sport,
                "Type" : bet?.type,
                "MyTeam" : bet?.myTeam,
                "Accepted": bet?.isAccepted,
                "Creator": bet?.creator,
                "Acceptor": bet?.acceptor,
                "CreatedByMe": bet?.createdByMe
            }
            return dataObj
        })
        return jsonArray
    }

    useEffect(() => {
        if (bets) {
            const data = createJsonData(bets, games)
            setJson(data)
        }
    }, [json, bets])

    const headers = ['Placed', 'Kickoff', 'Event', 'Bet', 'Who']

    if (json === null) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {!bets || bets.length === 0 ? (
                <div>
                    No bets to show
                </div>
            ) : (
            <table className='border-2 justify-center w-full'>
                <thead className='hidden block absolute sm:table-header-group sm:relative'>
                    <tr>
                        <th>Placed</th>
                        <th>Kickoff</th>
                        <th>Event</th>
                        <th>Bet</th> 
                        <th>Who</th>
                    </tr>
                </thead>
                <tbody>
                    {json && json.map((rowData) => {
                        return (
                            <tr>
                                <td className='flex items-center text-center mt-8 h-9 sm:pt-0 sm:table-cell before:content-["Placed"] sm:before:content-none before:font-bold before:w-[120px]'>{rowData.Placed}</td>
                                <td className='flex items-center text-center h-9 sm:table-cell before:content-["Kickoff"] sm:before:content-none before:font-bold before:w-[120px]'>{rowData.Kickoff}</td>
                                <td className='flex items-center text-center h-9 sm:table-cell before:content-["Event"] sm:before:content-none before:font-bold before:w-[120px]'>
                                    <div className='flex flex-row items-center justify-center'>
                                        <b>{`${rowData.Sport}: `}</b>
                                        <TeamLogo name={rowData.AwayTeam} width={50} />
                                        <small>@</small>
                                        <TeamLogo name={rowData.HomeTeam} width={50} />
                                    </div>
                                </td>
                                <td className='flex items-center text-center h-9 sm:table-cell before:content-["Bet"] sm:before:content-none before:font-bold before:w-[120px]'>
                                    {`${rowData.MyTeam}: $100 to win $200`}
                                </td>
                                <td className='flex items-center text-center h-9 sm:table-cell before:content-["Who"] sm:before:content-none before:font-bold before:w-[120px]'>
                                    <>
                                        {rowData.CreatedByMe ? (
                                            <div className='flex flex-row items-center justify-center'>
                                                <Blockies
                                                    seed={rowData.Creator}
                                                    size={10}
                                                    scale={3}
                                                />
                                                <MdHandshake size={'2em'}/>
                                                <a 
                                                    href={`${config[chainId].explorerURL}/address/${rowData.Acceptor}`} 
                                                    target='_blank' 
                                                    rel='noreferrer'
                                                    className='flex flex-row items-center'
                                                >
                                                    <Blockies
                                                        seed={rowData.Acceptor}
                                                        size={10}
                                                        scale={3}
                                                    />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className='flex flex-row items-center justify-center'>
                                                <a 
                                                    href={`${config[chainId].explorerURL}/address/${rowData.Creator}`} 
                                                    target='_blank' 
                                                    rel='noreferrer'
                                                    className='flex flex-row items-center'
                                                >
                                                    <Blockies
                                                        seed={rowData.Creator}
                                                        size={10}
                                                        scale={3}
                                                    />
                                                </a>
                                                <MdHandshake size={'2em'}/>
                                                <Blockies
                                                    seed={rowData.Acceptor}
                                                    size={10}
                                                    scale={3}
                                                />
                                            </div>
                                        )}
                                        
                                    </>
                                </td>
                                {showMyBets && (
                                    <td className='flex items-center sm:table-cell before:font-bold before:w-[120px]'>
                                        <button className='mt-2 sm:ml-2 sm:mt-0 p-2 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-700'>Cancel</button>
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            )}
        </div>
    )
}

export default BetTable
