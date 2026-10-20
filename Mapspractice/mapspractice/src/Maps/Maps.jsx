

import { useState, useRef, useEffect, useContext } from "react";
import { GoogleMap, Circle, Marker } from "@react-google-maps/api";
import "./Maps.css";
import { AppContext } from "../Context/Context";
import Alerts from "./Alerts";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "../firebase";

const containerStyle = {
  width: "90%",
  height: "70vh",
  margin: "20px auto", // ✅ centers the map horizontally
  borderRadius: "20px",
 

};

const radiusInMeters = 10;

function Maps() {
  const { location, setLocation, isLoaded } = useContext(AppContext);
  const [map, setMap] = useState(null);
  const [deviceCenter, setDeviceCenter] = useState(null);
  const [firebaseError, setFirebaseError] = useState(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [trackedLocations, setTrackedLocations] = useState([]);


  // Get static location from Firestore (center point)
  useEffect(() => {
    const fetchStaticLocation = async () => {
      const db = getFirestore(firebaseApp);
      const staticRef = doc(db, "users", "uUq0U6Ya6VQtKJBs5Dxi1F3Vm412");

      try {
        const staticSnap = await getDoc(staticRef);
        if (!staticSnap.exists()) {
          setFirebaseError("Static user not found");
          return;
        }

        const staticLoc = staticSnap.data().locationDetails;
        const staticPoint = {
          lat: parseFloat(staticLoc.latitude),
          lng: parseFloat(staticLoc.longitude),
        };

        setDeviceCenter(staticPoint);
        if (map) map.panTo(staticPoint);
      } catch (err) {
        console.error("Error fetching static center:", err);
        setFirebaseError("Failed to fetch static location");
      }
    };

    fetchStaticLocation();
  }, [map]);

  // Fetch all users and check who is inside radius
  useEffect(() => {
    if (!map || !deviceCenter) return;

    const fetchAllUsers = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const querySnap = await getDocs(collection(db, "users"));
        const inRange = [];

        querySnap.forEach((docSnap) => {
          if (docSnap.id === "uUq0U6Ya6VQtKJBs5Dxi1F3Vm412") return; // ❌ Exclude static user  DB3OE7h0SaWnw5NY3bEKvIHJieW2   5od2V5fml9SmMtBILhWmm9s12163

          const data = docSnap.data();
          const loc = data.locationDetails;

          if (loc?.latitude && loc?.longitude) {
            const point = {
              lat: parseFloat(loc.latitude),
              lng: parseFloat(loc.longitude),
            };

            if (isPointInCircle(point, deviceCenter, radiusInMeters)) {
              inRange.push(point);
            }
          }
        });

        setTrackedLocations(inRange);
        console.log(inRange);
        setFirebaseError(null);

        if (audioUnlocked && inRange.length > 0) {
          playAlertSound();
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setFirebaseError(`Firestore error: ${err.message}`);
      }
    };

    fetchAllUsers();
    const interval = setInterval(fetchAllUsers, 8000);
    return () => clearInterval(interval);
  }, [map, deviceCenter, audioUnlocked]);

  const onLoad = (mapInstance) => {
    console.log("Map loaded");
    setMap(mapInstance);
  };

  const isPointInCircle = (point, circleCenter, radius) => {
    if (!window.google?.maps?.geometry) {
      console.warn("Google Maps geometry library not loaded");
      return false;
    }

    return (
      window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(point.lat, point.lng),
        new window.google.maps.LatLng(circleCenter.lat, circleCenter.lng)
      ) <= radius
    );
  };

  const playAlertSound = () => {
    const audio = document.getElementById("alertAudio");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn("🎧 Audio play failed:", e));
    }
  };



  const unlockAudio = () => {
    const audio = document.getElementById("alertAudio");
    if (audio) {
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          setAudioUnlocked(true);
          console.log("🔊 Audio unlocked");
        })
        .catch((e) => {
          console.warn("🔒 Audio unlock failed:", e);
        });
    }
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;
  if (!deviceCenter) return <div>Getting your location...</div>;

  return (
    <div>
      <div className="MapsContainer">
        {firebaseError && (
          <div className="error-banner">Error: {firebaseError}</div>
        )}

<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
  <GoogleMap
    mapContainerStyle={{
      width: "90%",
      height: "70vh",
      margin: "20px 0 30px 0",
      borderRadius: "20px",
    }}
    center={deviceCenter}
    zoom={15}
    onLoad={onLoad}
    options={{
      mapId: "dc94429164479620",
      mapTypeId: "roadmap",
    }}
  >
    {/* Static Location Radius */}
    <Circle
      center={deviceCenter}
      radius={radiusInMeters}
      options={{
        strokeColor: "#4a90e2",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4a90e2",
        fillOpacity: 0.15,
      }}
    />

    {/* Static Marker */}
    <Marker
      position={deviceCenter}
      icon={{
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      }}
    />

    {/* Users within radius (excluding static user) */}
    {trackedLocations.map((loc, index) => (
      <Marker
        key={`tracked-${index}`}
        position={loc}
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      />
    ))}
  </GoogleMap>
</div>


        <div className="alerts">
          <div className="buttonenable">
            {!audioUnlocked && (
              <button
                onClick={unlockAudio}
               className="btn"
              >
                🔊
              </button>
            )}

            <audio
              id="alertAudio"
              preload="auto"
              onCanPlayThrough={() => console.log("✅ Audio can play")}
              onError={(e) => console.error("❌ Audio load failed", e)}
            >
              <source src="/buzzer.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
        </div>
      </div>
        <Alerts />
    </div>
  
  );
}

export default Maps;
