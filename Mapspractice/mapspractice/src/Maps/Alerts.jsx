// import React from 'react';
// import './Alerts.css';




// const AlertContainer = () => {
//     const alerts = [
//   {
//     title: "📍 Location Update",
//     message: "Vehicle moved to Vizianagaram Railway Station.",
//   },
//   {
//     title: "📍 Location Update",
//     message: "Vehicle moved to Vizianagaram bus Station.",
//   },
//   {
//     title: "⚠️ Warning",
//     message: "Location not updated in the last 10 minutes.",
//   },
//   {
//     title: "✅ Sync Complete",
//     message: "Latest coordinates synced from Firebase.",
//   },
//   {
//     title: "❌ Error",
//     message: "Failed to fetch location from Firebase. Retrying...",
//   },
//   {
//     title: "🚀 Map Refreshed",
//     message: "Map view updated to latest tracking position.",
//   },
// ];
//   return (
//     <div className="alert-container">
//         <h1 className='alertsHeading'>Alerts</h1>
//       {alerts.map((alert, index) => (
//         <div key={index} className="alert-card">
//           <h4>{alert.title}</h4>
//           <p>{alert.message}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AlertContainer;


// import { useState, useEffect } from "react";
// import "./Alerts.css";

// // Firebase Firestore
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { firebaseApp } from "../firebase";

// function UserDataCard() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const db = getFirestore(firebaseApp);
//         const userDocRef = doc(db, "users", "5od2V5fml9SmMtBILhWmm9s12163");

//         const docSnap = await getDoc(userDocRef);
        
//         if (!docSnap.exists()) {
//           throw new Error("User document not found");
//         }

//         const data = docSnap.data();
//         console.log("Fetched user data:", data);
        
//         setUserData({
//           name: data.name || "Not available",
//           phoneNumber: data.phoneNumber || "Not available",
//           vehicleNumber: data.vehicleNumber || "Not available",
//           location: data.locationDetails ? {
//             latitude: data.locationDetails.latitude,
//             longitude: data.locationDetails.longitude,
//             timestamp: data.locationDetails.timestamp || "Not available"
//           } : null
//         });

//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//     const interval = setInterval(fetchUserData, 8000); // Refresh every 8 seconds
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return <div className="card loading">Loading user data...</div>;
//   if (error) return <div className="card error">Error: {error}</div>;

//   return (
//     <div className="user-data-container">
//       <div className="user-card">
//         <h2>User Tracking Details</h2>
        
//         <div className="info-section">
//           <h3>Personal Information</h3>
//           <div className="info-row">
//             <span className="info-label">Name:</span>
//             <span className="info-value">{userData.name}</span>
//           </div>
//           <div className="info-row">
//             <span className="info-label">Phone:</span>
//             <span className="info-value">{userData.phoneNumber}</span>
//           </div>
//         </div>

//         <div className="info-section">
//           <h3>Vehicle Information</h3>
//           <div className="info-row">
//             <span className="info-label">Vehicle Number:</span>
//             <span className="info-value">{userData.vehicleNumber}</span>
//           </div>
//         </div>

//         {userData.location && (
//           <div className="info-section">
//             <h3>Location Details</h3>
//             <div className="info-row">
//               <span className="info-label">Latitude:</span>
//               <span className="info-value">{userData.location.latitude}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Longitude:</span>
//               <span className="info-value">{userData.location.longitude}</span>
//             </div>
//             <div className="info-row">
//               <span className="info-label">Last Updated:</span>
//               <span className="info-value">{userData.location.timestamp}</span>
//             </div>
//           </div>
//         )}

//         <div className="status-indicator">
//           <div className="status-dot active"></div>
//           <span>Live Tracking Active</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserDataCard;



import { useState, useEffect } from "react";
import "./Alerts.css";

// Firebase Firestore
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase";

function UserDataCard() {
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const radiusInMeters = 15;

  const isPointInCircle = (point, center, radius) => {
    if (!window.google?.maps?.geometry) return false;
    return window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(point.lat, point.lng),
      new window.google.maps.LatLng(center.lat, center.lng)
    ) <= radius;
  };

  useEffect(() => {
    const fetchUsersWithinRadius = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const centerRef = doc(db, "users", "uUq0U6Ya6VQtKJBs5Dxi1F3Vm412");
        const centerSnap = await getDoc(centerRef);

        if (!centerSnap.exists()) throw new Error("Center user not found");

        const centerLoc = centerSnap.data().locationDetails;
        const center = {
          lat: parseFloat(centerLoc.latitude),
          lng: parseFloat(centerLoc.longitude),
        };

        const usersRef = collection(db, "users");
        const allUsersSnap = await getDocs(usersRef);

        const inRangeCards = [];

        allUsersSnap.forEach(docSnap => {
          if (docSnap.id === "uUq0U6Ya6VQtKJBs5Dxi1F3Vm412") return; // Skip center user

          const data = docSnap.data();
          const loc = data.locationDetails;

          if (loc?.latitude && loc?.longitude) {
            const point = {
              lat: parseFloat(loc.latitude),
              lng: parseFloat(loc.longitude),
            };

            if (isPointInCircle(point, center, radiusInMeters)) {
              inRangeCards.push({
                id: docSnap.id,
                name: data.name || "Not available",
                phoneNumber: data.phoneNumber || "Not available",
                vehicleNumber: data.vehicleNumber || "Not available",
                location: {
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  timestamp: loc.timestamp || "Not available",
                }
              });
            }
          }
        });

        setUserCards(inRangeCards);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithinRadius();
    const interval = setInterval(fetchUsersWithinRadius, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="card loading">Loading user data...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="user-data-container">
      {userCards.map(userData => (
        <div key={userData.id} className="user-card">
          <h2>Emergency Tracking Details</h2>
          <br/>

          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value user-name">{userData.name}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Vehicle Information</h3>
            <div className="info-row">
              <span className="info-label">Vehicle Number:</span>
              <span className="info-value user-name">{"AP39B30856"}</span>
            </div>
          </div>

          {userData.location && (
            <div className="info-section">
              <h3>Location Details</h3>
              <div className="info-row">
                <span className="info-label">Latitude:</span>
                <span className="info-value user-name">{userData.location.latitude}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Longitude:</span>
                <span className="info-value user-name">{userData.location.longitude}</span>
              </div>
            </div>
          )}

          <div className="status-indicator">
            <div className="status-dot active"></div>
            <span>Live Tracking Active</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDataCard;
