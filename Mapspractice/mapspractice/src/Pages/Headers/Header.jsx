// import React from 'react'
// import "./Header.css"
// import { Link } from 'react-router-dom'
// import logo from "./logo.jpg"
// function Header() {
//     return (

//         <>
//             <nav>
//                 <div className="Headercontainer">
//                     <div className="logo-container">
//                         <div className="logo-image">
//                             <img src={logo} alt="App Logo" className="logo-image" />
//                         </div>

                        
//                             <div className="header">
//                                 FastLane Emergency Tracker
//                             </div>
                       
//                     </div>
//                     {/* <div>
//                        <Link to="/Login" className="login-link">Login</Link>
//                     </div> */}


//                 </div>
                
//             </nav>
//             <hr />
//         </>
//     )
// }

// export default Header

import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import logo from './logo.jpg';

function Header() {
  return (
    <>
      <nav>
        <div className="Headercontainer">
          <div className="logo-container">
            <div className="logo-image">
              <img src={logo} alt="App Logo" />
            </div>
            <div className="header">FastLane Emergency Tracker</div>
          </div>

          
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Header;
