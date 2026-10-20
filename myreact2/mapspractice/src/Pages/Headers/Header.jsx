import React from 'react'
import "./Header.css"
import { Link } from 'react-router-dom'
function Header() {
  return (
    
    <>
    <nav>
        <div className="Headercontainer">
            <h3>
                Logo
            </h3>
            <ul>
                <li>
                    <Link to="/Home" className='Link'>Home</Link>
                </li>
                <li>
                    <Link to="/AddHome" className='Link'>Add Home</Link>
                </li>
                <li>
                    Profile
                </li>
                <li>
                    Sign Up
                </li>
            </ul>
        </div>
    </nav>
    <hr />
    </>
  )
}

export default Header