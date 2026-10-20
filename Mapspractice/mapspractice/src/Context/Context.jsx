import React, { createContext, useEffect, useState } from 'react'
import { GoogleMap, useLoadScript,  } from "@react-google-maps/api";

export const AppContext = createContext();
const libraries = ["places","marker"]
function Context(props) {
  const [location,setLocation] = useState(null);
  const [token,setToken] = useState("");
      const {isLoaded}  = useLoadScript({
          googleMapsApiKey:"AIzaSyA_Yg6Bp5AHqTVsxdBUQh7MuoBIO45cOHQ", 
          libraries,
        });
// AIzaSyAGkPZ5WHTpGjbTQ6Irr2JetUPE7gigyDg
//AIzaSyA_Yg6Bp5AHqTVsxdBUQh7MuoBIO45cOHQ
//AIzaSyBUNjONdpkOrOSVDWbfnwM0MlyK-cmsaWs
    useEffect(()=>{
      setToken(localStorage.getItem("token"));
    },[token]);
   

    const values={
      location,setLocation,isLoaded,token,setToken,
    }
    
  return (
    <>
    <AppContext.Provider value={values}>
    {props.children}
    </AppContext.Provider>
    
    </>
  )
}

export default Context