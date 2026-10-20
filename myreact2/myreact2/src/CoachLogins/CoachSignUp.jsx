import Header from "../Components/Header"
import Footer from "../Components/Footer"
import CoachImg from "../assets/coach.png"
import axios from "axios"
import {useNavigate,Link} from "react-router-dom"
import "../styles/CoachProfile.css"
import {useState} from "react"


function CoachProfile() {
    const navigate = useNavigate();
    const [Name,setname] = useState("");
    const [dob,setdob] = useState("");
    const [email,setemail] = useState("");
    const [gender,setgender] = useState("");
    const [speciality,setspecility] = useState("");
    const [password,setpassword] = useState("");
  function HandleSubmit(e){
    e.preventDefault();
    axios.post("http://localhost:4000/CoachSignUp",{Name,dob,email,password,gender,speciality}).then((data)=>{
        console.log("Signed up successfully",data);
        navigate("/Home/CoachLogin");
    }).catch((e)=>{
        console.log(e)
    })
  }

    return (
        <>
            <Header />
            <form onSubmit={HandleSubmit} method="post">
            <div className="ProfileCoach">
                <div className="ProfileCoachCont">
                    <div className="ProfileHead">
                        <img src={CoachImg} />
                        <h2 className="ProfileHeading">
                            Life Coach Profile
                        </h2>
                    </div>

                    <div className="cont">
                        <div className="leftcont">
                            <label >Name</label>
                            <input type="text" name="Name" id="Name" onChange={(e)=>setname(e.target.value)}/>
                            <label >Date of Birth</label>
                            <input type="date" name="dob" id="Dob" onChange={(e)=>setdob(e.target.value)}/>
                            <label >Email</label>
                            <input type="text" name="email" id="email" onChange={(e)=>setemail(e.target.value)}/>
                        </div>
                        <div className="rightcont">
                            <label >Password</label>
                            <input type="passWord" name="password" id="password" onChange={(e)=>setpassword(e.target.value)}/>
                            <div className="GenderCont">
                                <label>Gender</label>
                                <br />
                                <div className="GenderCont-child">

                                    <input type="radio" name="gender" value="Male" onChange={(e)=>setgender(e.target.value)}/><label className="GenderLabel">Male</label>
                                    <input type="radio" name="gender" value="Female" onChange={(e)=>setgender(e.target.value)}/><label className="GenderLabel">Female</label>

                                </div>


                            </div>

                            <label >Speciality</label>
                            <input type="text" name="speciality" id="Speciality" onChange={(e)=>setspecility(e.target.value)}/>
                        </div>

                    </div>
                    <div className="CoachSignup">
                    <button type="submit">SignUp as a Coach</button>

                    
                    </div>
                </div>
            </div>
            </form>
            <Footer />
        </>
    )


}



export default CoachProfile;