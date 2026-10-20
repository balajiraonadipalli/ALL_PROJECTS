import React, { useContext, useState, useEffect } from 'react';
import Header from '../Headers/Header';
import './AddHome.css';
import { AppContext } from '../../Context/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function AddHome() {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const navigate = useNavigate();
  const [cityName,setCityName] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(()=>{
    
    console.log(token);
    if(token){
      const callHome = async function(){
      try {
        
         const user = await axios.get("http://localhost:7777/api/addHome",{
           headers:{
             authorization:`Bearer ${token}`
           }
         });
         console.log(user.data.message);
        }
        
        catch (error) {
         console.log(error);
         
       }
      }
       callHome();
      
       }else{
        setTimeout(()=>{
        navigate("/Login");
        toast.error("Please Login");
        },0);
       }
    },
[navigate,token]);

async function savetheAddress(){
  console.log(token);
  try {
    const addAddress = await axios.post("http://localhost:7777/api/addHome",{
      cityName,
      placeName,
    },
  {
     headers:{
      authorization:`Bearer ${token}`
     }
  });
    toast.success("Saved the details successfully")

   } catch (error) {
    console.log(error);
    toast.error(error.message);
   }
}
    function getLocation() {
      toast.success("Loading Please wait");
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords);
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude }); // ✅ Fixed key names
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            // ✅ Use Geocoder to get place name
            const latlng = { lat: latitude, lng: longitude };
            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === "OK") {
                if (results[0]) {
                  setPlaceName(results[0].formatted_address);
                  console.log(`Place Name: ${results[0].formatted_address}`);
                } else {
                  console.log("No results found");
                }
              } else {
                console.error(`Geocoder failed due to: ${status}`);
              }
            });
          },
          (error) => {
            console.error("Error getting location: ", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }



  return (
    <>
      <Header />
      <div className='addHomeDiv'>
        <h2>Current Location:</h2>
        <p>
          Current Latitude andd Longitude:
        </p>
       
          <textarea value={location?`Latitude: ${location.lat}, Longitude: ${location.lng}`:"Here You are going to get the latitude and longitude values based on your Location"} readOnly >
             
          </textarea>
          <textarea value={placeName?`${placeName}`:"Here you are going to get the current Address Based on your Locaion"} readOnly >

          </textarea>
          <input type="text" placeholder='Enter the city or town Name as mentioned above' onChange={(e)=> setCityName(e.target.value)}/>

        {
          !location?<button onClick={()=>getLocation()}>
          get the Location
          </button>:<button onClick={()=>savetheAddress()}>
        Save the Location
        </button>

        }
        
        
        
      </div>
    </>
  );
}

export default AddHome;
