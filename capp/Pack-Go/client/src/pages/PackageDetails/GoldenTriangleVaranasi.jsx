import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles.css";
import image1 from "./PackageImages/image1.jpg";
import image2 from "./PackageImages/image2.jpg";
import image3 from "./PackageImages/image3.jpg";
import image4 from "./PackageImages/image4.jpg";
import image5 from "./PackageImages/image5.jpg";

const images = [image1, image2, image3, image4, image5];

const GoldenTriangleVaranasi = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="package-container">
      <div className="package-header">
        <h1>Golden Triangle with Varanasi</h1>
        <p>Delhi – Jaipur – Agra – Varanasi</p>
        <p>Best Time to Travel: September – April</p>
        <p>08 Days / 07 Nights</p>
      </div>

      <div className="slider-container">
        <button className="prev-btn" onClick={prevImage}>❮</button>
        <img src={images[currentIndex]} alt="Golden Triangle Tour" className="slider-image" />
        <button className="next-btn" onClick={nextImage}>❯</button>
      </div>

      <div className="trip-details">
        <div className="trip-info">
          <h2>Trip Highlights</h2>
          <ul>
            <li><strong>Delhi:</strong> India Gate, Qutub Minar, Humayun’s Tomb.</li>
            <li><strong>Jaipur:</strong> Hawa Mahal, City Palace, Amber Fort.</li>
            <li><strong>Agra:</strong> Taj Mahal, Agra Fort.</li>
            <li><strong>Varanasi:</strong> Ganga Aarti, Kashi Vishwanath Temple, Sarnath.</li>
          </ul>
        </div>

        <div className="booking-section">
          <h3 className="price">Price: $1199 per person</h3>
          <button className="book-now" onClick={() => navigate("/payment")}>Buy Now</button>
          <button className="wishlist" onClick={() => navigate("/wishlist")}>♡ Add to Wishlist</button>
        </div>
      </div>

      <div className="day-wise-plan">
        <h2>Day Wise Itinerary</h2>
        {[
          { day: "Arrive in Delhi", details: "Meet our representative and transfer to hotel. Overnight in Delhi." },
          { day: "Explore Delhi", details: "Visit India Gate, Humayun’s Tomb, Qutub Minar, and more." },
          { day: "Delhi to Jaipur", details: "Drive to Jaipur, explore Pink City. Overnight in Jaipur." },
          { day: "Jaipur Sightseeing", details: "Visit Amber Fort, City Palace, and Hawa Mahal." },
          { day: "Jaipur to Agra", details: "Drive to Agra, visit Fatehpur Sikri en route. Overnight in Agra." },
          { day: "Agra to Varanasi", details: "Visit the Taj Mahal, then take an evening train to Varanasi." },
          { day: "Varanasi Sightseeing", details: "Morning boat ride on Ganges, visit Kashi Vishwanath Temple and Sarnath." },
          { day: "Departure from Varanasi", details: "Transfer to the airport for onward journey." }
        ].map((item, index) => (
          <div className="day" key={index} onClick={() => setActiveDay(activeDay === index ? null : index)}>
            <h3>Day {index + 1}: {item.day}</h3>
            {activeDay === index && <p>{item.details}</p>}
          </div>
        ))}
      </div>

      <div className="included-section">
        <h2>What's Included</h2>
        <ul>
          <li>🏨 Accommodation in 5-star hotels</li>
          <li>🍽️ Daily Breakfast</li>
          <li>🚗 Private Transportation</li>
          <li>🎟️ Entry Fees</li>
        </ul>
      </div>

      <div className="customer-reviews">
        <h2>Customer Reviews</h2>
        {[
          { name: "Amit Sharma", rating: 5, comment: "An amazing trip!" },
          { name: "Sophia Patel", rating: 4.5, comment: "Well planned and organized." }
        ].map((review, index) => (
          <div className="review" key={index}>
            <h3>{review.name}</h3>
            <p>Rating: {"⭑".repeat(Math.round(review.rating))}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldenTriangleVaranasi;