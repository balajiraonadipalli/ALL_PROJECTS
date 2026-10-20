import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import Context from './Context/Context.jsx'
import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <Context>
 <App />
 <ToastContainer position="top-center" autoClose={3000} />
 </Context>
 
   
 </BrowserRouter>
)
