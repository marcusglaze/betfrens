import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'

import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom'

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadContract,
  loadGames,
  loadBets
} from './store/interactions'

import config from './config.json'

import Navbar from './components/Navbar'
import Home from './components/Home'
import AllBets from './components/AllBets'
import Settings from './components/Settings'
import Game from './components/Game'
import MyBets from './components/MyBets'

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch)
    const { chainId } = await loadNetwork(provider, dispatch)
    const contract = await loadContract(provider, config[chainId].PeerDuel.address, dispatch)

    await loadGames(provider, contract, dispatch);
    await loadBets(provider, contract, dispatch);

    // reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  })

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/allbets' element={<AllBets />} />
        <Route path='/mybets' element={<MyBets />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/gameId/:gameId' element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App
