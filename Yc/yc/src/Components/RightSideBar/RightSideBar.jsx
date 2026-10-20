import React, { useContext, useEffect, useState } from 'react'
import "./RightSideBar.css"
import assets from '../../assets/assets/assets'
import { logout } from '../../Config/Firebase'
import { AppContext } from '../../Context/AppContext'
function RightSideBar() {

    const {chatUser,messages} = useContext(AppContext); 
    const [messageImg,setmessageImg] = useState([]);
  useEffect(()=>{
    let temp = [];
    messages.map((msg)=>{
      if(msg.image){
        temp.push(msg.image);
      }
    })
    console.log(temp);
    setmessageImg(temp);
  },[messages])

  return chatUser?(
    <>
    <div className="rs">
        <div className="rs-profile">
            <img src={chatUser.userData.avatar} alt="" />
            <h3>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000?<img src={assets.green_dot} className='dot'/>:null}</h3>
           
            <p>
            {chatUser.userData.bio}
            </p>
        </div>
        <hr />
        <div className="rs-media">
            <p>Media</p>
            <div>
              {messageImg.map((url,index)=>(
                <img key={index} src={url} onClick={()=>window.open(url)} alt="" />
              ))};
            </div>
            <button onClick={logout}>
            Log out
            </button>
        </div>
    </div>
    </>
  ):
  (
    <div className='rs'>
      <button onClick={()=>logout}>
        LogOut
      </button>
    </div>
  )
}

export default RightSideBar