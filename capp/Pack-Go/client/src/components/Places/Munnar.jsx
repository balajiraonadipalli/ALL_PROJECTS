import React, { useState, useEffect } from "react";
import "./Places.css";
import { useNavigate } from "react-router-dom";
import 'boxicons/css/boxicons.min.css';

// Import Images
import munnarImg1 from "../../assets/PlaceImages/Munnar1.jpeg";
import munnarImg2 from "../../assets/PlaceImages/Munnar2.jpeg";
import munnarImg3 from "../../assets/PlaceImages/Munnar3.jpeg";

const Munnar = () => {
  const images = [munnarImg1, munnarImg2, munnarImg3];
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="place-container">
      <h1 className="place-title">Munnar Tourism</h1>

      <div className="place-content">
        <div className="place-images">
          <img src={images[currentImage]} alt="Munnar" className="place-image" />
        </div>

        <div className="booking-section animate-section">
          <h2>Explore Munnar</h2>
          <p className="trip-price">Trip Price: ₹7,499 per person</p>
          <div className="booking-buttons">
            <button className="book-now" onClick={() => navigate("/payment")}>Book Now</button>
            <button className="wishlist" onClick={() => navigate("/wishlist")}>
              <i className='bx bx-heart'></i> Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="place-details animate-section">
        <h2>Munnar Tourism</h2>
        <p>✅ <strong>Kashmir of South India</strong> – Famous for tea estates, greenery, misty hills, and stunning viewpoints.</p>
        <p>✅ <strong>Tea Plantations</strong> – Explore vast tea gardens and visit the Tata Tea Museum.</p>
        <p>✅ <strong>Wildlife & Nature</strong> – Eravikulam National Park and Salim Ali Bird Sanctuary.</p>
        <p>✅ <strong>Adventure & Activities</strong> – Trekking, paragliding, boating, and jeep safaris.</p>
        <p>✅ <strong>Rare Neelakurinji Flowers</strong> – Blooms once in 12 years, next in 2030.</p>
      </div>

      <div className="trip-details animate-section">
        <div className="places-offer">
          <h2>Places Offered</h2>
          <ul>
            <li>Eravikulam National Park - Home to the Nilgiri Tahr.</li>
            <li>Mattupetty Dam - Boating and scenic beauty.</li>
            <li>Echo Point - Unique natural echo phenomenon.</li>
            <li>Top Station - Highest point in Munnar with breathtaking views.</li>
            <li>Tea Gardens - Learn about tea processing and enjoy fresh tea.</li>
          </ul>
        </div>
        <div className="trip-plan">
          <h3>3-Day Trip Plan</h3>
          <ol>
            <li><b>Day 1:</b> Arrive in Munnar, visit local tea plantations and markets.</li>
            <li><b>Day 2:</b> Explore Eravikulam National Park, Mattupetty Dam, and Echo Point.</li>
            <li><b>Day 3:</b> Visit Top Station, Tata Tea Museum, and depart.</li>
          </ol>
        </div>
      </div>

      <div className="travel-info animate-section">
        <h2>Must-Know Travel Tips</h2>
        <ul>
          <li>Best Time to Visit: September to May for the best weather.</li>
          <li>Anamudi Peak remains closed from February to March.</li>
          <li>Tata Tea Museum is closed on Mondays.</li>
          <li>Entry fee for Eravikulam National Park: ₹50, open 9:00 AM - 3:00 PM.</li>
          <li>Avoid monsoon season for trekking, as trails can be slippery.</li>
          <li>Munnar is famous for spices like cardamom, cinnamon, and homemade chocolates.</li>
        </ul>
      </div>
    </div>
  );
};

export default Munnar;