import Student from "./Student"
import Cars from "./Cars"
import LoginType from "./Components/LoginType"
import CoachLogin from "./CoachLogins/CoachLogin"
import CoachSignUp from "./CoachLogins/CoachSignUp"
import UserProfile from "./UserLogins/UserProfile"
import UserLogin from "./UserLogins/UserLogin"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OCRUploader from "./OCRUploader"

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route element={ <UserLogin/>} path="/Home/UserLogin"></Route >
    <Route element={ <LoginType/>} path="/Home"></Route >
    <Route element={ <CoachSignUp/>} path="/Home/CoachSignUp"></Route >
    <Route element={ <UserProfile/>} path="/Home/UserProfile"></Route >
    <Route element={ <CoachLogin/>} path="/Home/CoachLogin"></Route >
    <Route element={ <OCRUploader/>} path="/ocr"></Route>
    </Routes>
    </BrowserRouter>
    
    
    </>
  )
}

export default App





// {/* <Student name="Ram" age={30} isStudent={true}/> */}
//     {/* <Cars/> */}