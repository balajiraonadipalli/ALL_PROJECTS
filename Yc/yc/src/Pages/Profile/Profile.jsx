import React, { useContext, useEffect, useState } from 'react'
import "./Profile.css"
import assets from '../../assets/assets/assets'
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/Firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload } from '../../lib/Upload';
import { AppContext } from '../../Context/AppContext';
function Profile() {
  const [image,setimage] = useState("");
  const [prevImg,setPrevImage] = useState("");
  const [name,setname] = useState("");
  const [bio,setbio] = useState("");
  const [uid,setuid] = useState("");
  const navigate = useNavigate();
  const {setuserData} = useContext(AppContext);

  const ProfileUpdate = async(e)=>{
    e.preventDefault();
    try {
      if(!prevImg && !image){
        toast.error("Upload Profile Image")
      }
      const docRef = doc(db,"Users",uid);
      console.log("image",image);
      
      
      if(image){
        const imgUrl = await Upload(image);
        console.log(imgUrl);
        setPrevImage(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          bio:bio,
          name:name,
        })
      }
      else{
        await updateDoc(docRef,{
          bio:bio,
          name:name,
        })
      }
      const snap = await getDoc(docRef);
      setuserData(snap.data());
      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }

  }
  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        setuid(user.uid);
        const docRef = doc(db,"Users",user.uid);
          const docSnap = await getDoc(docRef);
          if(( docSnap).data().name){
            setname(( docSnap).data().name);
            
          }
          if(( docSnap).data().bio){
            setbio((docSnap).data().bio);
          }
          if((docSnap).data().avatar){
            setPrevImage((docSnap).data().avatar)
          }  
         
      }
      else{
        navigate("/Login");
      }
    })
  },[])
  return (
    <>
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={ProfileUpdate}>
        <h3>
          Profile Details
        </h3>
        <label htmlFor="avatar">
          <input onChange={(e)=>setimage(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden/>
          {/* <img src={prevImg?URL.createObjectURL(image):assets.avatar_icon} alt="" /> */}
          <img src={prevImg?prevImg:assets.avatar_icon} alt="" />

          Upload Profile Image
        </label>
        <input type="text" placeholder='Your name' required onChange={(e)=> setname(e.target.value)} value={name}/>
        <textarea placeholder='Write profile bio' required onChange={(e)=> setbio(e.target.value)} value={bio}>

        </textarea>
        <button type='submit'>
          Save
        </button>
        </form>
        <img src={prevImg?prevImg:assets.logo_icon} alt="" className='profile-pic'/>

        {/* <img src={image?URL.createObjectURL(image):prevImg?prevImg:assets.logo_icon} alt="" className='profile-pic'/> */}
        {/* <img src={prevImg?URL.createObjectURL(image):assets.logo_icon} alt="" className='profile-pic'/> */}

      </div>
    </div>
    </>
  )
}

export default Profile
