import React, { useContext, useEffect, useState } from 'react'
import "./ChatBox.css"
import assets from '../../assets/assets/assets'
import { AppContext } from '../../Context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../Config/Firebase';
import { Upload } from '../../lib/Upload';
function ChatBox() {
    const {userData,messagesId,chatUser,messages,setmessages} = useContext(AppContext);
    const [input,setInput] = useState("");
    const sendMessage = async ()=>{
        try {
            if(input && messagesId){
                await updateDoc(doc(db,"messages",messagesId),{
                    messages:arrayUnion({
                        sId:userData.id,
                        text:input,
                        createdAt:new Date(),
                        
                    })
                })
                const UserIds = [chatUser.rId,userData.id];
                UserIds.forEach(async(id)=>{
                    const userChatsRef = doc(db,"chats",id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.charData.findIndex((c)=>c.messageId === messagesId);
                        console.log(chatIndex);
                        
                        

                        userChatData.charData[chatIndex].lastMessage = input.slice(0,30);
                        userChatData.charData[chatIndex].updatedAt = Date.now();
                        if(userChatData.charData[chatIndex].rId === userData.id){
                            userChatData.charData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef,{
                            charData:userChatData.charData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.messsage);
        }
        setInput("");
    }

    const sendImage = async (e)=>{
        try {
            const fileUrl = await Upload(e.target.files[0]);
            if(fileUrl && messagesId){
                await updateDoc(doc(db,"messages",messagesId),{
                    messages:arrayUnion({
                        sId:userData.id,
                        image:fileUrl,
                        createdAt:new Date(),
                        
                    })
                })
                const UserIds = [chatUser.rId,userData.id];
                UserIds.forEach(async(id)=>{
                    const userChatsRef = doc(db,"chats",id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
                    if(userChatsSnapshot.exists()){
                        const userChatData = userChatsSnapshot.data();
                        const chatIndex = userChatData.charData.findIndex((c)=>c.messageId === messagesId);
                        console.log(chatIndex);
                        userChatData.charData[chatIndex].lastMessage = "Image";
                        userChatData.charData[chatIndex].updatedAt = Date.now();
                        if(userChatData.charData[chatIndex].rId === userData.id){
                            userChatData.charData[chatIndex].messageSeen = false;
                        }
                        await updateDoc(userChatsRef,{
                            charData:userChatData.charData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const conTime = (timestamp) =>{
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        if(hour>12){
            return hour-12 + ":" + minute + "PM";
        }
        else{
            return hour + ":" + minute + "AM";
        }
    }
    useEffect(()=>{
        if(messagesId){
            const unSub = onSnapshot(doc(db,"messages",messagesId),(res)=>{
                setmessages(res.data().messages);
                console.log(res.data().messages.reverse());
            })
            return ()=>{
                unSub();
            }
        }
       
    },[messagesId])
    
  return chatUser? (
    <div className="chat-box">
        <div className="chat-user">
            <img src={chatUser.userData.avatar} alt="" />
            <p>{chatUser.userData.name}{" "} {Date.now() - chatUser.userData.lastSeen <= 70000?<img src={assets.green_dot} className='dot'/>:null}</p>
            <img src={assets.help_icon}  alt="" />
        </div>

        <div className="chat-messages">
            {messages.map((msg,index)=>(
                <div key={index} className={msg.sId === userData.id? "s-message": "r-message"}>
                    {msg["image"]?
                    <img src={msg.image} className='msg-img'/> :
                    <p className='msg'>
                    {msg.text}
                </p>
                }
                
                <div>
                    <img src={msg.sId === userData.id? userData.avatar: chatUser.userData.avatar} alt="" />
                    <p>
                    {conTime(msg.createdAt)}
                    </p>
                </div>
            </div>
            ))}
        </div>


        <div className="chat-input">
            <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='send a text message...'/>
            <input onChange={sendImage} type="file" id="image" accept='image/png,image/jpeg' hidden/>
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt="" />
            </label>
            <img onClick={sendMessage} src={assets.send_button} alt="" />

        </div>
    </div>
  ):
  <div className='chat-welcome'>
    <img src={assets.logo_icon} alt=''/>
    <p>
        Chat anytime,anyWhere
    </p>
  </div>
}

export default ChatBox