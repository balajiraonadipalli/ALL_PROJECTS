// import React, { useState, useEffect } from "react";
// import { toast,ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {useNavigate} from "react-router-dom";
// import axios from "axios";
// import "./Login.css"; // Import CSS for styling

// const AuthForm = () => {
//   const [isLoginActive, setIsLoginActive] = useState(false);
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     setMessage(""); // Reset message on component mount
//   }, [isLoginActive]);

//   const handleLoginClick = () => {
//     setIsLoginActive(true);
//   };

//   const handleSignupClick = () => {
//     setIsLoginActive(false);
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:8000/api/signup", {
//         username:name,
//         email,
//         password,
//       }).then((res)=>{
//         console.log(res.data);
//       }).catch((err)=>{
//         console.log(err);
//       })
//       setMessage(response.data.message);
//       toast.success("Sign Up is done Successfully");
      
//     } catch (error) {
//       setMessage("Signup failed. Try again.");
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:8000/api/login", {
//         email,
//         password,
//       }).then((res)=>{
//         console.log(res.data);
//       }).catch((err)=>{
//         console.log(err);
//       });
//       navigate("/");
//       setMessage(response.data.message);
//       toast.success("Log in Successfully completed")
//     } catch (error) {
//       setMessage("Login failed. Check credentials.");
//     }
//   };

//   return (
//     <form>
//       <div className="parent">
//         <div className="form-structor">
//           {message && <p className="message">{message}</p>}
//           {/* Signup Section */}
//           <div className={`signup ${isLoginActive ? "slide-up" : ""}`}>
//             <h2 className="form-title" id="signup" onClick={handleSignupClick}>
//               <span>or</span>Sign up
//             </h2>
//             <div className="form-holder">
//               <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//               <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             </div>
//             <button className="submit-btn" onClick={handleSignup}>Sign up</button>
//           </div>

//           {/* Login Section */}
//           <div className={`login ${isLoginActive ? "" : "slide-up"}`}>
//             <div className="center">
//               <h2 className="form-title" id="login" onClick={handleLoginClick}>
//                 <span>or</span>Log in
//               </h2>
//               <div className="form-holder">
//                 <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               </div>
//               <button className="submit-btn" onClick={handleLogin}>Log in</button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer/>
//     </form>
//   );
// };

// export default AuthForm;

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Import CSS for styling

const AuthForm = () => {
  const [isLoginActive, setIsLoginActive] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Reset error messages when switching between login/signup
  }, [isLoginActive]);

  const handleLoginClick = () => setIsLoginActive(true);
  const handleSignupClick = () => setIsLoginActive(false);

  // **Signup Function**
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/signup", {
        username: name,
        email,
        password,
      });

      console.log(response.data);
      toast.success("Sign Up Successfully!"); // ✅ Toast on success
      navigate("/")
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Try again!"); // ✅ Toast on failure
    }
  };

  // **Login Function**
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:8000/api/login", {
  //       email,
  //       password,
  //     });

  //     console.log(response.data);
  //     toast.success("Login Successful!"); // ✅ Toast on success
  //     navigate("/"); // Redirect to home page
      
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Login failed. Check credentials!"); // ✅ Toast on failure
  //   }
  // };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
  
      console.log(response.data);
      
      if (response.data.success) {  // Assuming your API sends success: true
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user details in localStorage
        toast.success("Login Successful!");
  
        setTimeout(() => {
          navigate("/"); // ✅ Delayed navigation
        }, 2000);
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check credentials!");
    }
  };

  return (
    <form>
      <div className="parent">
        <div className="form-structor">
          {/* Signup Section */}
          <div className={`signup ${isLoginActive ? "slide-up" : ""}`}>
            <h2 className="form-title" id="signup" onClick={handleSignupClick}>
              <span>or</span>Sign up
            </h2>
            <div className="form-holder">
              <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="submit-btn" onClick={handleSignup}>Sign up</button>
          </div>

          {/* Login Section */}
          <div className={`login ${isLoginActive ? "" : "slide-up"}`}>
            <div className="center">
              <h2 className="form-title" id="login" onClick={handleLoginClick}>
                <span>or</span>Log in
              </h2>
              <div className="form-holder">
                <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="submit-btn" onClick={handleLogin}>Log in</button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </form>
  );
};

export default AuthForm;