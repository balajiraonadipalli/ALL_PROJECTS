import React, { useState } from 'react'
import "./Login.css"
import { login, signup } from '../../Config/Firebase';
import { useNavigate } from 'react-router-dom';
import assests from "../../assets/assets/assets"
import Chat from '../Chat/Chat';
function Login() {
    const navigate = useNavigate();
    const [currentState,setcurrentState] = useState("Sign Up");
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    async function handleSubmit(e){
        e.preventDefault();
        if(currentState === "Sign Up"){
            signup(username,email,password);
        }
        else{
            await login(email,password);
            navigate("/chat");
        }

    }
  return (
    

    <>
    <div className="login">
        <img src={assests.logo} alt="logo" className='logo'/>
        <form  className="login-Form" onSubmit={handleSubmit}>
            <h2>
                {currentState}
            </h2>
            {currentState === "Sign Up"?<input type="text" className="formInput" placeholder='username' required onChange={(e)=> setusername(e.target.value)}/>
:null}
            <input type="email" className="formInput" placeholder='email' required onChange={(e)=>setemail(e.target.value)}/>
            <input type="password" className="formInput" placeholder='password' required onChange={(e)=> setpassword(e.target.value)}/>
            <button type='submit' className='Submit'>
                {currentState==="Sign Up"?"Create account":"Login"}
            </button>
            <div className="login-term">
                <input type="checkbox" required/>
                <p>Agree the terms and conditions.</p>
            </div>
            <div className="login-forgot">
                {currentState ===  "Sign Up"?<p className='login-toggle'>Already have an account <span onClick={()=> setcurrentState("Login")}>clickHere</span></p>:<p className='login-toggle'>create new account <span onClick={()=> setcurrentState("Sign Up")}>clickHere</span></p>}
                
            </div>
        </form>
    </div>
    </>
  )
}

export default Login