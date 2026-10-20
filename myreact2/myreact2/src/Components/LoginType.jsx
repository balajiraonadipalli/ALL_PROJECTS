import '../styles/Login.css'

import images from "../assets/coach.png"
import user from "../assets/user.png"
import Header from "./Header"
import Footer from "./Footer"
import {Link} from "react-router-dom"

function LoginType(){

    return(
        <>
        <Header/>
        <div className='content'>
            <div className="heading">
                <h2> We are the heart of appropriate care</h2>
            </div>
            <div className="logincards">
                <div className="coachcard card">
                    <img src={images} alt="coach"/>
                    <div className="cardbuttons">
                        
                    <Link to="CoachLogin" className='cardbuttons'>  <button>Login as a Coach</button></Link>
                    <Link to="CoachSignUp" className='cardbuttons'>  <button>SignUp as a Coach</button></Link>

                    
                    </div>
                </div>
                <div className="usercard card">
                <img src={user} alt="user"></img>
                <div className="cardbuttons">
                <Link to="UserLogin" className='cardbuttons'>  <button>Login as a User</button></Link>
                <Link to="UserProfile" className='cardbuttons'>  <button>SignUp as a User</button></Link>

                
                
                </div>
                </div>
            </div>

        </div>
        <Footer/>
        
        </>
    );

}

export default LoginType;
