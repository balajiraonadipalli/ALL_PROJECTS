import React from 'react'
import Maps from "./Maps/Maps"
import LoginPage from './LoginPage/LoginPage'
import Home from './Pages/Home'

import { Route, Routes } from 'react-router-dom'
import AddHome from './Pages/AddHome/AddHome'
function App() {
  return (
    
    <>
    <Routes>
      <Route path="/Home" element={<Home/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/AddHome" element={<AddHome/>}/>
      <Route path="/Login" element={<LoginPage/>}/>

    </Routes>
    {/* <LoginPage/> */}
    {/* <Home/> */}
    {/* <Maps /> */}
    </>
  )
}

export default App