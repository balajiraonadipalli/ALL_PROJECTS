import React from 'react'
import Maps from "./Maps/Maps"
import Home from './Pages/Home'

import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    
    <>
    <Routes>
      <Route path="/Home" element={<Home/>}/>
      <Route path="/" element={<Home/>}/>
    
      {/* <Route path="/Login" element={<LoginPage/>}/> */}

    </Routes>
    {/* <LoginPage/> */}
    {/* <Home/> */}
    {/* <Maps /> */}
    </>
  )
}

export default App