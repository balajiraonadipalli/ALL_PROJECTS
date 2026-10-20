import React from 'react'
import Menubar from './Menubar'
import {Routes,Route} from "react-router-dom"
import TopDestinations from "./TopDestinations"
import SpiritualDestinations from './Categories/SpiritualDestinations'
import HillStations from './Categories/HillStations'
import Deserts from './Categories/Deserts'
import Beaches from './Categories/Beaches'
import LoginPage from './Login/LoginPage'
import Home from './Home'
import SignUpPage from './Login/SignUpPage'
function App() {
  return (
    <>
    <Menubar />
    <Routes>
    <Route path="/" element={<Home/>}/>
      <Route path="/TopDestinations" element={<TopDestinations/>}/>
      <Route path="/SpiritualDestinations" element={<SpiritualDestinations/>}/>
      <Route path="/HillStations" element={<HillStations/>}/>
      <Route path="/Deserts" element={<Deserts/>}/>
      <Route path="/Beaches" element={<Beaches/>}/>
      <Route path="/LoginPage" element={<LoginPage/>}/>
      <Route path="/SignUpPage" element={<SignUpPage/>}/>

     
    </Routes>
    </>
  )
}

export default App