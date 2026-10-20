import { useState, useRef, useEffect, useContext } from "react";
import { GoogleMap, useLoadScript, Autocomplete } from "@react-google-maps/api";
import "./Maps.css"
import App from "../App";
import { AppContext } from "../Context/Context";
const containerStyle = {
  width: "80%",
  height: "400px",
  margin:"20px 0px 30px 0px",
  borderRadius:"20px"
  
};

const defaultCenter = {
  lat: 18.1067, // Vizianagaram center coordinates
  lng: 83.3956,
};

const libraries = ["places", "marker"];

const places = [
  { id: 1, name: "Vizianagaram Railway Station", position: { lat: 18.1124, lng: 83.4115 } },
  { id: 2, name: "Maharaja Fort", position: { lat: 18.1071, lng: 83.4006 } },
  { id: 3, name: "RTC Bus Stand", position: { lat: 18.1092, lng: 83.4021 } },
  { id: 4, name: "Sri Pydithalli Ammavari Temple", position: { lat: 18.1119, lng: 83.4105 } },
  { id: 5, name: "Vizianagaram Collector Office", position: { lat: 18.1065, lng: 83.4048 } },
];

function Maps() {
  
  const {location,setLocation} = useContext(AppContext);
  const {isLoaded} = useContext(AppContext);

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (map) {
      
      const newMarkers = places.map((place) => {
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: place.position,
            map,
            title: place.name,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${place.name}</strong></div>`,
          });

          // ✅ Use `addEventListener` for compatibility
          marker.addEventListener("click", () => {
            infoWindow.open(map, marker);
          });

          return marker;
        }
        return null;
      });

      setMarkers(newMarkers);
    }
  }, [map]);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      
      map.panTo(place.geometry.location);
      map.setZoom(15);

      
      // addMarker(place.geometry.location);
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    addMarker({ lat, lng });
    console.log("lat",lat,"lng",lng);
  };

  const addMarker = (position) => {
    if (map && window.google?.maps?.marker?.AdvancedMarkerElement) {
      const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position,
        map,
      });

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    }
    
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="MapsContainer">
      {/* ✅ Search Box */}
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          placeholder="Search for a place"
          
        />
      </Autocomplete>

      {/* ✅ Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onClick={handleMapClick}
        options={{
          mapId: "dc94429164479620", // ✅ Use environment variable for Map ID
        }}
      />
    </div>
  );
}

export default Maps;
