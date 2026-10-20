import React from 'react'
import StartPage from './components/indexpage/StartPage'
import {Routes,Route} from "react-router-dom"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<StartPage />}/>
      
    </Routes>
    </>
  )
}

export default App