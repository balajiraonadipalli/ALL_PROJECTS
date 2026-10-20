import Header from "../Components/Header"
import Footer from "../Components/Footer"
import '../styles/CoachLogin.css';
import Coach from "../assets/user.png"

function UserLogin(){
    return(
        <>
        <Header/>

        <div className="contentLogin">
            <div className="CoachLoginCont">
                <header>
                    <img src={Coach} className="UserImage"/>
                    <p>Login As User</p>
                </header>
               <div className="Logins">
               <input type="text" placeholder="User Id"/>
                
                <input type="password" placeholder="PassWord"/>
               </div>
                <button>Login</button>
            </div>

        </div>
        <Footer/>
        </>
    )
}

export default UserLogin;