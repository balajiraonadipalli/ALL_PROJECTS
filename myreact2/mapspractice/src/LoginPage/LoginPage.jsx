import React, { useContext, useState } from 'react'
import "../LoginPage/LoginPage.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/Context';
function LoginPage() {
    const [login,setLogin] = useState(false);
    const [username,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const{token,setToken} = useContext(AppContext);
    const navigate = useNavigate();
async function HandleSubmit(e){
    e.preventDefault();

        if(login){
            try {
                const user = await axios.post("http://localhost:7777/api/login",{
                    email,password,
                });
                console.log(user.data.user.token);
                localStorage.setItem("token",JSON.stringify(user.data.user.token));
                setToken(user.data.user.token);
                toast.success("Login successful");
                navigate("/")
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }else{
            try {
                const newUser = await axios.post("http://localhost:7777/api/register",{
                    username,
                    email,
                    password
                });
                console.log(newUser.data);
                toast.success("signUp successful Login with your credentials")
            } catch (error) {
                console.log(error);
            }
        }
    }
    function handleLogin(){
        setLogin(!login);
    }
    return (
        <>
            <div className="container">
                <div className="pageCont">
                    <h3>
                        {login?"Login":"SignUp"}
                    </h3>
                    <div className="inputs">
                        {
                            !login?<div className="name">
                            <label htmlFor="Name">
                                Name:
                            </label>
                            <br />
                        
                            <input type="text" placeholder='Enter the Name' id="Name" onChange={(e)=>setUserName(e.target.value)}/>
                        </div>:""
                        }
                        <div className="Email">
                            <label htmlFor="email">
                                Email:
                            </label>
                            <br />
                            <input type="email" placeholder='Enter the Email' id="email" onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className="Password">
                            <label htmlFor="password">
                                Password:
                            </label>
                            <br />
                            <input type="password" placeholder='Enter the Password' id="Password" onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                    </div>
                    {
                        !login?<p>Already Have an Account? <span onClick={handleLogin}>Click Here</span></p>:
                        <p>Don't Have an Account? <span onClick={handleLogin}>Click Here</span></p>
                    }

                    <button type="submit" onClick={HandleSubmit}>
                        {
                            login?"Login":"Sign Up"
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default LoginPage