// import React from "react";

// const WishlistPage = () => {
  
//   return (
//     <div style={{margin:"80px"}}>
//       <h1>Your Wishlist</h1>
//       <p>Here are your saved trips.</p>
//     </div>
//   );
// };

// export default WishlistPage;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/wishlist", {
          withCredentials: true, // Ensures cookies are sent with request
        });
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        if (error.response?.status === 401) {
          alert("You need to log in first!");
          navigate("/loginpage");
        }
      }
    };

    fetchWishlist();
  }, [navigate]);

  return (
    <div style={{ margin: "80px" }}>
      <h1>Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <ul>
          {wishlist.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>No trips saved in your wishlist.</p>
      )}
    </div>
  );
};



export default WishlistPage;