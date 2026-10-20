// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import {getFirestore,setDoc,doc} from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCglJ-bQX_RW4EKbm4kiLt0rfFf6xU03ck",
  authDomain: "capp-ded1b.firebaseapp.com",
  projectId: "capp-ded1b",
  storageBucket: "capp-ded1b.firebasestorage.app",
  messagingSenderId: "408099142917",
  appId: "1:408099142917:web:fd8d13c9da180a028f8b6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 const auth = getAuth(app);
const db = getFirestore(app);

const signup = async(username,email,password) =>{
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        console.log("User created",user);
        await setDoc(doc(db,"Users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey There i am using chat app",
            lastSeen:Date.now()
        });
        await setDoc(doc(db,"chats",user.uid),{
            charData:[],

        });
        console.log("chats documents created");
        toast.success("account Created successfully");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}

const login = async(email,password)=>{
    try{
        await signInWithEmailAndPassword(auth,email,password);
        toast.success("Login is Successful");

    }catch(err){
        console.error(err);
        toast.error(err.code.split("/")[1].split("-").join(" "));
    }

}

const logout = async()=>{
    try {
        await signOut(auth);
    toast.success("LoggedOut successfully");
    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
    
}

export {signup,login,logout,auth,db};