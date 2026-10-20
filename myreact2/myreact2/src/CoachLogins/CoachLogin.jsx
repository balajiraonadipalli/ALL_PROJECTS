import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../styles/CoachLogin.css';
import Coach from "../assets/coach.png";
import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import axios from "axios";

function CoachLogin(){
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const navigate = useNavigate();
    function HandleSubmit(e){
        e.preventDefault();
        axios.post("http://localhost:4000/CoachLogin",{email,password}).then((data)=>{
            console.log(data.data.message);
            alert(data.data.message)
            navigate("/Home/CoachLogin");
        }).catch((e)=>{
            console.log(e)
        })
      }
    return(
        <>
        <Header/>

        <form onSubmit={HandleSubmit} method="post">
        <div className="contentLogin">
            <div className="CoachLoginCont">
                <header>
                    <img src={Coach}/>
                    <p>Login As Life Coach</p>
                </header>
               <div className="Logins">
               <input type="email" placeholder="Coach email" onChange={(e)=>{setemail(e.target.value)}}/>
                
                <input type="password" placeholder="PassWord" onChange={(e)=>{setpassword(e.target.value)}}/>
               </div>
                <button type="submit">Login as LifeCoach</button>

            </div>

        </div>
        </form>
        <Footer/>
        </>
    )
}

export default CoachLogin;