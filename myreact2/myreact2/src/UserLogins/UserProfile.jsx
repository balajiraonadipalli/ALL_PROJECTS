import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../styles/CoachProfile.css";
import UserImg from "../assets/User.png"
import "../styles/UserProfile.css"

function UserProfile() {

    return (
        <>
            <Header />
            <div className="ProfileCoach">
                <div className="ProfileUserCont">
                    <div className="ProfileHead">
                        <img src={UserImg} />
                        <h2 className="ProfileHeading">
                            User Profile
                        </h2>
                    </div>

                    <div className="cont">
                        <div className="leftcont">
                            <label for="Name">Name</label>
                            <input type="text" name="Name" id="Name" />

                            <label for="Dob">Date of Birth</label>
                            <input type="date" name="Dob" id="Dob" />
                            <label for="MobileNumber">Phone Number</label>
                            <input type="Number" name="Dob" id="MobileNumber" />
                            <label for="PinCode">PinCode</label>
                            <input type="Number" name="PinCode" id="PinCode" />
                            <label for="State">State</label>
                            <input type="text" name="State" id="Sate" />
                        </div>
                        <div className="rightcont">
                            <label for="Password">PassWord</label>
                            <input type="passWord" name="Name" id="Name" />
                            <label for="email">Email</label>
                            <input type="email" name="email" id="email" />
                            <div className="GenderCont">
                                <label>Gender</label>
                                <div className="GenderCont-child">

                                    <input type="radio" name="Gender" value="Male" className="GenderLabelInput"/><label className="GenderLabel">Male</label>
                                    <input type="radio" name="Gender" value="Female" className="GenderLabelInput"/><label className="GenderLabel">Female</label>

                                </div>


                            </div>


                            <label for="City">City</label>
                            <input type="text" name="City" id="City" />
                            <label for="Country">Country</label>
                            <input type="text" name="Country" id="Country" />
                        </div>
                       
                    </div>
                    <div className="LoginButton">
                    <button> Sign Up</button>
                    </div>
                    
                </div>
            </div>


            <Footer />

        </>
    );
}

export default UserProfile;