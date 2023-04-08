import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blockies from 'react-blockies'
import { 
    MdMenu, 
    MdHome, 
    MdSettings,
    MdHandshake,
    MdReceipt
} from 'react-icons/md'
import { loadAccount } from '../store/interactions'

import { NavLink as Link } from 'react-router-dom'

import SlidingPane from 'react-sliding-pane'
import 'react-sliding-pane/dist/react-sliding-pane.css'

import config from '../config.json'

const NavLink = ({ path, name, icon, handleClick}) => {
    return (
        <Link 
            to={path}
            className='flex flex-row items-center py-2'
            onClick={handleClick}
        >
            {icon}
            <div className='px-2'>
                {name}
            </div>
        </Link>
    )
}

const Navbar = () => {

    const dispatch = useDispatch()

    const provider = useSelector(state => state.provider.connection)
    const chainId  = useSelector(state => state.provider.chainId)
    const account  = useSelector(state => state.provider.account)
    //const balance  = useSelector(state => state.provider.balance)

    const [showSidebar, setShowSidebar] = useState(false)

    const connectHandler = async () => {
        await loadAccount(provider, dispatch)
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    }

    return (
        <div className='flex flex-row py-2'>

            <div className='flex flex-row items-center'>
                <button onClick={toggleSidebar} className='px-2 mx-4 rounded-full hover:bg-slate-300 active:bg-slate-200'>
                    <MdMenu size={'2em'}/>
                </button>
                <Link 
                    to='/'
                    className='text-2xl font-bold mr-20'
                >
                    Betfrens
                </Link>
            </div>

            <div className='flex items-center justify-end w-full mx-5'>
                {account ? (
                    <a 
                        href={`${config[chainId.chainId].explorerURL}/address/${account}`} 
                        target='_blank' 
                        rel='noreferrer'
                        className='flex flex-row items-center'
                    >
                        <Blockies
                            seed={account}
                            size={10}
                            scale={3}
                        />
                        <div className='text-blue-800 ml-2'>
                            {account.slice(0,5) + '...' + account.slice(38,42)}
                        </div>
                    </a>
                ) : (
                    <button 
                        onClick={connectHandler}
                        className='bg-blue-300 p-2 rounded-lg shadow-lg text-gray-700 font-bold hover:bg-blue-400'
                    >
                        Connect
                    </button>
                )}
            </div>

            <SlidingPane
                isOpen={showSidebar}
                from='left'
                width='200px'
                onRequestClose={() => setShowSidebar(false)}
            >
                <div>
                    <NavLink path='/' name='Home' icon={<MdHome />} handleClick={toggleSidebar} />
                    <NavLink path='/allbets' name='All Bets' icon={<MdHandshake />} handleClick={toggleSidebar} />
                    <NavLink path='/mybets' name='My Bets' icon={<MdReceipt />} handleClick={toggleSidebar} />
                    <NavLink path='/settings' name='Settings' icon={<MdSettings />} handleClick={toggleSidebar} />
                </div>
            </SlidingPane>
        </div>
    )
}

export default Navbar
