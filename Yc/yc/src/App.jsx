import React,{useContext, useEffect} from 'react'
import {Routes,Route, useNavigate} from "react-router-dom"
import Login from "./Pages/Login/Login"
import Chat from './Pages/Chat/Chat'
import Profile from './Pages/Profile/Profile'
import { ToastContainer, toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "./Config/Firebase";
import { AppContext } from './Context/AppContext'

function App() {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext);
  useEffect(()=>{

     onAuthStateChanged(auth,async(user)=>{
      if(user){
        await loadUserData(user.uid);
        // navigate("/chat");
      }else{
        navigate("/");
      }

    });
    
  },[]);
  return (
    <>

    
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/chat" element={<Chat />}/>
      <Route path="/Profile" element={<Profile />}/>

     
    </Routes>
    </>
  )
}

export default App