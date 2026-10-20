import React from 'react';

const Profile = () => {
  // Mock user authentication state (replace with actual authentication logic)
  const user = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data
    window.location.reload(); // Refresh the page to reflect logout
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-lg" style={{margin:"80px auto"}}>
      {user ? (
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold">Please log in</h2>
          <button 
            onClick={() => window.location.href = '/loginpage'} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;