import React from 'react'
import ProductCard from './components/ProductCard'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import  Laptop from "./components/Laptop"
import Smartphone from './components/SmartPhones'
import SmartPhoneDetails from './components/SmartPhoneDetails'
import LaptopDetails from './components/LaptopDetails'
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<ProductCard/>}>
    </Route>
    <Route path="/Laptop" element={<Laptop/>}>
    </Route>
    <Route path="/SmartPhone" element={<Smartphone/>}>
    </Route>
    <Route path="/SmartPhone/:brand" element={<SmartPhoneDetails/>}>
    </Route>
    <Route path="/Laptop/:brand" element={<LaptopDetails/>}>
    </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App