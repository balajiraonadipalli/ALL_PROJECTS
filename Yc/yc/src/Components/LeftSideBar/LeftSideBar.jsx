import React, { useContext, useState } from 'react'
import "./LeftSideBar.css"
import assets from '../../assets/assets/assets'
import { Link } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Config/Firebase'
import { AppContext } from '../../Context/AppContext'
import { toast } from 'react-toastify'
function LeftSideBar() {
    const { userData,chatData,chatUser,setchatUser,messagesId,setmessagesId, } = useContext(AppContext);
    const [user, setUser] = useState("");
    const [search, setSearch] = useState("");
    
        const inputHandler = async (e) => {
            const input = e.target.value;
            if (input) {
                setSearch(true);
                const userRef = collection(db, 'Users');
                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q);
                if (!querySnap.empty && querySnap.docs[0].id !== userData.id) {
                    // console.log(querySnap.docs[0].data());
                    // setUser(querySnap.docs[0].data());
                    let userExist = false;
                    chatData.map((user)=>{
                        if(user.rId == querySnap.docs[0].data().id){
                            userExist = true;
                        }
                    })
                    if(!userExist){
                        setUser(querySnap.docs[0].data());
                    }
                } else {
                    setUser(null);
                }
            } else {
                setSearch(false);
            }

        }
    const addChat = async ()=>{
        const messagesRef = collection(db,"messages");
        const chatsRef = collection(db,"chats");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef,{
                createAt:serverTimestamp(),
                messages:[]
            })
            await updateDoc(doc(chatsRef,user.id),{
                charData:arrayUnion({
                    messageId:newMessageRef.id,
                    lastMessage:"",
                    rId:userData.id,
                    updatedAt:Date.now(),
                    messageSent:true,
                })
            })
            await updateDoc(doc(chatsRef,userData.id),{
                charData:arrayUnion({
                    messageId:newMessageRef.id,
                    lastMessage:"",
                    rId:user.id,
                    updatedAt:Date.now(),
                    messageSent:true,
                })
            })
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }
    const setChat = async (item) =>{
        try {
            setmessagesId(item.messageId);
        setchatUser(item);
        const userChatsRef = doc(db,"chats",userData.id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        const userChatsData = userChatsSnapshot.data();
        const chatIndex = userChatsData.charData.findIndex((c)=>c.messageId === item.messageId);
        userChatsData.charData[chatIndex].messageSeen = true;
        await updateDoc(userChatsRef,{
            charData:userChatsData.charData,
        })
        } catch (error) {
         toast.error(error.message);   
        }
    }

    return (
        <>
            <div className="ls">
                <div className="ls-top">
                    <div className="ls-nav">
                        <img src={assets.logo} alt="logo" />
                        <div className="menu">
                            <img src={assets.menu_icon} alt="menu" />
                            <div className="sub-menu">

                                <Link to="/Profile" className='link'>Edit Profile</Link>

                                <hr />
                                <p>
                                    Log out
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="ls-search">
                        <img src={assets.search_icon} alt="search Icon" />
                        <input type="text" placeholder='Search here...' onChange={inputHandler} />
                    </div>
                </div>
                <div className="ls-list">
                    {setSearch && user
                        ? <div onClick={addChat} className='friends add-user'>
                            <img src={user.avatar} alt="" />
                            <p>
                                {user.name}
                            </p>
                        </div> :
                            chatData.map((item, index) => (
                            <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ?"":"border"}`} >
                                <img src={item.userData.avatar} alt="" />
                                <div>
                                    <p>
                                        {item.userData.name}
                                    </p>
                                    <span>
                                        {item.lastMessage}
                                    </span>
                                </div>
                            </div>
                        ))}


                </div>
            </div>

        </>
    )
}

export default LeftSideBar