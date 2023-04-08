import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SlidingPane from 'react-sliding-pane'
import 'react-sliding-pane/dist/react-sliding-pane.css'
import Blockies from 'react-blockies'
import Select from 'react-dropdown-select'
import moment from 'moment/moment'
import { NavLink as Link } from 'react-router-dom'

import TeamLogo from './TeamLogo'
import { gameBetsSelector } from '../store/selectors'

import { MdHandshake, MdTimer } from 'react-icons/md'

const BetCategory = ({ category }) => {
    return (
        <div className='bg-gray-200'>
            <div className='ml-4 text-gray-600 text-sm'>
                {category}
            </div>
        </div>
    )
}

const DisplayBets = ({ bets, onClickFn, showAllBets }) => {

    const account  = useSelector(state => state.provider.account)

    const [isHovered, setIsHovered] = useState(false)

    bets = bets.sort((a, b) => b.creatorAmount - a.creatorAmount)

    return (
        <div>
            {bets.map((bet,index) => {
                return (
                    <button 
                        key={index} 
                        className='px-4 py-2 flex flex-row w-full hover:bg-gray-100'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => onClickFn(bet)}
                    >
                        <div className='flex flex-row items-center'>
                            <TeamLogo name={bet.acceptorTeam} width={50} height={50}/> 
                            <div className='ml-1'>
                                {bet.acceptorTeam}  
                            </div>
                            <div className='flex flex-col mx-3 px-2 bg-blue-200'>
                                <div className='font-bold'>-133</div>
                                <div>$531</div>
                            </div>
                        </div>
                        <div className='flex flex-row items-center ml-20 mt-2'>
                            <div className='flex flex-row items-center'>
                                <Blockies
                                    seed={bet.creator}
                                    size={10}
                                    scale={3}
                                />
                                <MdHandshake size={'2em'}/>
                                {isHovered && account ? (
                                    <div className='flex flex-row'>
                                        <Blockies
                                            seed={account}
                                            size={10}
                                            scale={3}
                                        />
                                        {/*
                                        <div className='ml-2 text-gray-700 font-bold'>
                                            Accept?
                                        </div>
                                        */}
                                    </div>
                                ) : (
                                    <div className='bg-gray-400 py-1 px-3 text-white font-bold'>
                                        ?
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

const GameEntry = ({ game, index, showAllBets }) => {

    const [isBetSlipVisible, setIsBetSlipVisible] = useState(false)
    const [betSlipData, setBetSlipData] = useState([])
    const [activeBox, setActiveBox] = useState()
    const [currencyValue, setCurrencyValue] = useState(1)
    const [betTeam, setBetTeam] = useState()
    const [expireTime, setExpireTime] = useState(moment())
    const [timeLeft, setTimeLeft] = useState(0)
    const [activeExpireTime, setActiveExpireTime] = useState()

    const bets = useSelector(gameBetsSelector(game.gameId))

    const moneylineBets = bets.filter((b) => b.type === 'moneyline')
    const handicapBets = bets.filter((b) => b.type === 'handicap')
    const overUnderBets = bets.filter((b) => b.type === 'over/under')

    const activeBoxStyle = 'items-center justify-center bg-blue-500 border-2 border-blue-300 rounded-md w-16 text-xs text-white font-bold'
    const notActiveBoxStyle = 'items-center justify-center border-2 border-blue-300 rounded-md w-16 text-xs hover:bg-blue-400'

    const activeTeamStyle = 'p-2 bg-blue-400'
    const notActiveTeamStyle = 'p-2 hover:bg-gray-200'

    const activeTimeStyle = 'flex justify-center w-2/12 text-sm items-center border-t-2 border-l-2 border-b-2 border-gray-300 bg-gray-300'
    const notActiveTimeStyle = 'flex justify-center w-2/12 text-sm items-center border-t-2 border-l-2 border-b-2 border-gray-300 hover:bg-gray-200'

    const handleSelect = (bet) => {
        setBetSlipData({bet, game})
        setIsBetSlipVisible(true)
    }

    const handleClose = () => {
        setIsBetSlipVisible(false)
        setActiveBox()
        setActiveExpireTime()
        setTimeLeft()
    }

    const handlePlaceBet = () => {
        setBetSlipData({game})
        setIsBetSlipVisible(true)
        setExpireTime(moment())
    }

    const handleExpireSelect = (value, unit) => {
        const now = moment()
        const timeAtExpire = now.add(value, unit)
        setActiveExpireTime(`${value} ${unit}`)
        setExpireTime(timeAtExpire)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment()
            const diff = moment.duration(moment(expireTime).diff(now))
            setTimeLeft(diff.asSeconds())
        }, 1000);
        return () => clearInterval(interval)
    }, [expireTime])

    return (
        <div 
            key={index} 
            className='border-2 border-gray-200'
        >
            <div className='flex flex-row my-2'>
                <TeamLogo name='NBA' width={75} height={75} />
                <div className='-ml-3'>
                    <div className='text-sm'>
                       {game.formattedTimestamp}  
                    </div>
                    <Link 
                        to={`/gameId/${game.gameId}`}
                        className='flex flex-row font-bold hover:text-blue-500'
                    >
                        {`${game.awayTeam} at ${game.homeTeam}`}
                    </Link>
                </div>
            </div>

            {handicapBets.length > 0 && (
                <div>
                    <BetCategory category={'Handicap'} />
                    <DisplayBets bets={handicapBets} onClickFn={handleSelect} showAllBets={showAllBets} />
                </div>
            )}
            {moneylineBets.length > 0 && (
                <div>
                    <BetCategory category={'Moneyline'} />
                    <DisplayBets bets={moneylineBets} onClickFn={handleSelect} showAllBets={showAllBets} />
                </div>
            )}
            {overUnderBets.length > 0 && (
                <div>
                    <BetCategory category={'Over-under'} />
                    <DisplayBets bets={overUnderBets} onClickFn={handleSelect} showAllBets={showAllBets} />
                </div>
            )}

            <div className='flex m-4'>
                <button 
                    onClick={handlePlaceBet}
                    className='bg-blue-500 p-2 text-sm text-white font-bold rounded-2xl shadow-md hover:bg-blue-600'
                >
                    Place a bet
                </button>
            </div>

            <SlidingPane
                isOpen={isBetSlipVisible}
                title='Bet Slip'
                from='right'
                width='400px'
                onRequestClose={handleClose}
            >
                <div>
                    {betSlipData.bet ? (
                        <div>
                            <div className='flex flex-row -ml-8'>
                                <TeamLogo name='NBA' width={75} height={75} />
                                <div className='-ml-3'>
                                    <div className='text-sm'>
                                    {game.formattedTimestamp}  
                                    </div>
                                    <button className='flex flex-row text-sm font-bold hover:text-blue-500'>
                                        {`${game.awayTeam} at ${game.homeTeam}`}
                                    </button>
                                </div>
                            </div>

                            <div className='flex flex-row justify-center mt-4'>
                                <TeamLogo name={betSlipData.bet.acceptorTeam} width={75} height={75} />
                                <div className='flex items-center text-xl text-blue-800 font-bold'>
                                    {betSlipData.bet.type.toUpperCase()}
                                </div>
                            </div>

                            <div className='flex flex-row mt-4'>
                                <div className='w-1/2 h-1/2 rounded-xl shadow-lg p-4'>
                                    <div className='font-bold'>
                                        Creator's Bet
                                    </div>
                                    <div className='flex flex-row items-center mt-2'>
                                        <Blockies
                                            seed={betSlipData.bet.creator}
                                            size={10}
                                            scale={3}
                                        />
                                        <div className='ml-2'>
                                            {betSlipData.bet.creator.slice(0,5) + '...' + betSlipData.bet.creator.slice(38,42)}
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <TeamLogo name={betSlipData.bet.creatorTeam} width={50} height={50} />
                                    </div>
                                </div>
                                <div className='w-1/2 ml-3'>
                                    <Select 
                                        options={[{value: 1, label: 'MATIC'},{value: 2, label: 'DAI'}]}
                                        onChange={(value) => setCurrencyValue(value)}
                                    />
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            <p><b>your</b> odds</p>
                                        </div>
                                        <input 
                                            type='text' 
                                            className='bg-gray-300'
                                        />
                                    </div>
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            stake
                                        </div>
                                        <input 
                                            type='text' 
                                            className='bg-gray-300'
                                        />
                                    </div>
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            profit
                                        </div>
                                        <input 
                                            type='text'
                                            className='bg-gray-300' 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center m-12'>
                                <button 
                                    className='bg-blue-500 p-4 text-lg text-white font-bold rounded-2xl shadow-md hover:bg-blue-600'
                                >
                                    Place bet
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className='flex flex-row -ml-8'>
                                <TeamLogo name='NBA' width={75} height={75} />
                                <div className='-ml-3'>
                                    <div className='text-sm'>
                                    {game.formattedTimestamp}  
                                    </div>
                                    <button className='flex flex-row text-sm font-bold hover:text-blue-500'>
                                        {`${game.awayTeam} at ${game.homeTeam}`}
                                    </button>
                                </div>
                            </div>

                            <div className='mt-4'>
                                <div className='flex justify-center font-bold'>Select Team</div>
                                <div className='flex flex-row justify-center mt-2'>
                                    <button onClick={() => setBetTeam(game.awayTeam)} className={betTeam === game.awayTeam ? activeTeamStyle : notActiveTeamStyle}>
                                        <TeamLogo name={game.awayTeam} width={125} height={125} />
                                    </button>

                                    <button onClick={() => setBetTeam(game.homeTeam)} className={betTeam === game.homeTeam ? activeTeamStyle : notActiveTeamStyle}>
                                        <TeamLogo name={game.homeTeam} width={125} height={125} />
                                    </button>
                                </div>
                            </div>

                            
                            <div className='flex flex-row mt-4'>
                                <div className='w-1/2 h-1/2 rounded-xl shadow-lg p-4'>
                                    <div className='font-bold text-sm flex justify-center'>
                                        Bet
                                    </div>
                                    <div className='flex justify-center p-2 rounded-full hover:bg-gray-300'>
                                        <button>Moneyline</button>
                                    </div>
                                    <div className='flex justify-center p-2 rounded-full hover:bg-gray-300'>
                                        <button>Spread</button>
                                    </div>
                                    <div className='flex justify-center p-2 rounded-full hover:bg-gray-300'>
                                        <button>Over/Under</button>
                                    </div>
                                </div>
                                <div className='w-1/2 ml-3'>
                                    <Select 
                                        options={[{value: 1, label: 'MATIC'},{value: 2, label: 'DAI'}]}
                                        onChange={(value) => setCurrencyValue(value)}
                                    />
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            <p><b>your</b> odds</p>
                                        </div>
                                        <input 
                                            type='text' 
                                            className='bg-gray-300'
                                        />
                                    </div>
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            stake
                                        </div>
                                        <input 
                                            type='text' 
                                            className='bg-gray-300'
                                        />
                                    </div>
                                    <div className='bg-gray-300 mt-2 -mr-3'>
                                        <div className='flex justify-center'>
                                            profit
                                        </div>
                                        <input 
                                            type='text'
                                            className='bg-gray-300' 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-row mt-5'>
                                <button 
                                    onClick={() => handleExpireSelect(5, 'minutes')}
                                    className={activeExpireTime === '5 minutes' ? activeTimeStyle : notActiveTimeStyle}
                                >
                                    5m
                                </button>
                                <button 
                                    onClick={() => handleExpireSelect(15, 'minutes')} 
                                    className={activeExpireTime === '15 minutes' ? activeTimeStyle : notActiveTimeStyle}
                                >
                                    15m
                                </button>
                                <button 
                                    onClick={() => handleExpireSelect(1, 'hours')} 
                                    className={activeExpireTime === '1 hours' ? activeTimeStyle : notActiveTimeStyle}
                                >
                                    1h
                                </button>
                                <button 
                                    onClick={() => handleExpireSelect(2, 'hours')} 
                                    className={activeExpireTime === '2 hours' ? activeTimeStyle : notActiveTimeStyle}
                                >
                                    2h
                                </button>
                                <button 
                                    onClick={() => handleExpireSelect(6, 'hours')} 
                                    className={activeExpireTime === '6 hours' ? activeTimeStyle : notActiveTimeStyle}
                                >
                                    6h
                                </button>
                                <div className='flex justify-center w-2/12 text-sm items-center border-2 border-gray-300'>
                                    <MdTimer/>
                                </div>
                            </div>
                            <div className='flex justify-center p-2 border-2 border-gray-300 mt-2 text-sm'>
                                {expireTime.format('YYYY-MM-DD hh:mm A')}
                            </div>
                            {activeExpireTime && timeLeft < 3600 ? (
                            <div className='flex justify-center'>
                                {`expires in ${moment.utc(moment.duration(timeLeft, 'seconds').asMilliseconds()).format('mm:ss')}`}
                            </div>  
                            ) : (
                            <div className='flex justify-center'>
                                {`expires in ${moment.duration(timeLeft, 'seconds').humanize()}`}
                            </div>   
                            )}
                            
                            <div className='flex justify-center m-4'>
                                <button 
                                    className='bg-blue-500 p-4 text-lg text-white font-bold rounded-2xl shadow-md hover:bg-blue-600'
                                >
                                    Place bet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SlidingPane>
        </div>
    )
}

export default GameEntry
