import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapPreview({ lat, lng, label, listings = [], center, zoom = 12, minHeight = 400 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Determine coordinates to use
  let coordinates = null;
  if (lat && lng) {
    coordinates = { lat, lng };
  } else if (center) {
    coordinates = center;
  } else if (listings.length > 0) {
    const firstListing = listings[0];
    if (firstListing?.location?.coordinates) {
      coordinates = {
        lat: firstListing.location.coordinates.lat,
        lng: firstListing.location.coordinates.lng
      };
    }
  }

  const hasCoords = coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number';

  useEffect(() => {
    if (!hasCoords || !mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: true,
        touchZoom: true,
      });

      // Add OpenStreetMap tiles (no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for multiple listings
    if (listings.length > 0) {
      listings.forEach((listing, index) => {
        if (!listing.location?.coordinates) return;
        const listingCoords = listing.location.coordinates;
        
        const marker = L.marker([listingCoords.lat, listingCoords.lng], {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(mapInstanceRef.current);

        const price = Math.floor(listing.pricePerNight * 5); // 5 nights
        marker.bindPopup(`<div class="text-sm font-semibold">₹${price.toLocaleString()}</div>`);
        
        markersRef.current.push(marker);
      });

      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    } else {
      // Single location marker
      const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(mapInstanceRef.current);
      if (label) {
        marker.bindPopup(`<div class="text-sm font-semibold">${label}</div>`);
      }
      markersRef.current.push(marker);
      
      // Center map on marker
      mapInstanceRef.current.setView([coordinates.lat, coordinates.lng], zoom);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
      }
    };
  }, [coordinates?.lat, coordinates?.lng, zoom, listings.length, label]);

  if (!hasCoords) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div>Map location not available</div>
        </div>
      </div>
    );
  }

  const openInMaps = `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=${zoom}/${coordinates.lat}/${coordinates.lng}`;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border shadow-lg bg-gray-100" style={{ minHeight }}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight }}></div>
      
      {/* Map controls overlay */}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md z-[1000]">
        <div className="text-sm font-medium text-gray-800">{label || 'Location'}</div>
      </div>
      
      <div className="absolute bottom-4 right-4 z-[1000]">
        <a 
          href={openInMaps}
          target="_blank"
          rel="noreferrer"
          className="bg-white px-3 py-2 rounded-lg shadow-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Open in Maps
        </a>
      </div>

      {/* Price bubbles overlay for multiple listings */}
      {listings.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-[999]">
          {listings.slice(0, 12).map((listing, index) => {
            if (!listing.location?.coordinates) return null;
            const price = Math.floor(listing.pricePerNight * 5);
            const x = 20 + (index % 4) * 20 + Math.random() * 10;
            const y = 20 + Math.floor(index / 4) * 15 + Math.random() * 10;
            
            return (
              <div
                key={listing._id}
                className="absolute bg-white rounded-full px-2 py-1 shadow-md text-xs font-medium"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                ₹{price.toLocaleString()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
