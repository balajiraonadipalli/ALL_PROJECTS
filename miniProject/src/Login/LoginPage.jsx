import React from 'react'
import "./LoginPage.css"
function LoginPage() {
  return (
   <>
   <div className="bodycont">
   <div className="cont">
        <div className="sub-con">
            <input type="email" className="con1" placeholder="email-id"/>
            <input type="password" className="con2" placeholder="password"/>
            <div className="butoncon">
                <button className="button1">
                    submit
                </button>
            </div>
        </div>

    </div>
   </div>
   
   </>
  )
}

export default LoginPage