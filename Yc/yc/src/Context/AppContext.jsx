import { getDoc,doc, updateDoc, onSnapshot } from "firebase/firestore";
import { createContext, useState,useCallback, useEffect } from "react";
import {db,auth} from "../Config/Firebase"
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

const AppContextProvider = (props) =>{
    
    const [userData,setuserData] = useState(null);
    const [chatData,setchatData] = useState(null);
    const [messagesId,setmessagesId] = useState(null);
    const [messages,setmessages] = useState([]);
    const [chatUser,setchatUser] = useState(null);
    const navigate = useNavigate();
    const loadUserData = useCallback(async(uid)=>{
        try {
        
        const userRef = doc(db,"Users",uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setuserData(userData);
        console.log(userData);
        
        if(!userData.avatar && !!userData.name){
            navigate("/Profile");
        }
        else{
            // navigate("/chat");
        }
        
        setInterval(async ()=>{
            if(auth.chatUser){
                await updateDoc(userRef,{
                    lastSeen:Date.now()
                })
            console.log(lastSeen);
            }
        },60000);
        } catch (error) {
            
        }
    },[navigate]);
    useEffect(()=>{
        if(userData){
            const chatRef = doc(db,"chats",userData.id);
            const unSub = onSnapshot(chatRef,async (res)=>{
                const chatItems = res.data().charData;
                console.log(res.data());
                const tempData = [];
                console.log(chatItems);
                for(const item of chatItems){
                    const userRef = doc(db,"Users",item.rId);
                    const userSnap = await getDoc(userRef);
                    
                    const userData = userSnap.data();
                    tempData.push({...item,userData});
                }
                setchatData(tempData.sort((a,b)=> b.updatedAt - a.updatedAt))
            });
            return ()=>{
                unSub();
            }
        }
    },[userData]);
    const value = {
        userData,setuserData,
        chatData,setchatData,loadUserData,
        messages,setmessages,
        messagesId,setmessagesId,
        chatUser,setchatUser
    }

    return(
        <AppContext.Provider value={value}>
             {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
