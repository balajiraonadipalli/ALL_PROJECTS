import React, { useEffect, useState } from 'react';
import Image from "./assessts/background.jpg"
import axios from "axios"
import { formatNumber } from 'scichart';
import { toast, ToastContainer } from "react-toastify";
import { Navigate, useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate =  useNavigate();
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = isLogin ? validateLogin() : validateSignup();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      // Submit logic here - for now, just log the data
    if(!isLogin){
         try {
        const token = localStorage.getItem("token"); // Or wherever the token is stored
        console.log(formData);
        const response = await axios.post(
            "http://localhost:5000/api/register",
            {
                userName: formData.name,
                email:formData.email,
                password:formData.password,
            }
        );

        console.log(response.data);
        toast.success("Account created successfully Please Login with your credentials!"); // ✅ Toast on success
        navigate("/");
    } catch (error) {
        console.error(error);
        toast.error("Signup failed. Try again!"); // ✅ Toast on failure
    }
    }else{
         try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email:formData.email,
        password:formData.password,
      });
  
      console.log(response.data);
      
      // console.log(response.data.user.token);
      localStorage.setItem("token", JSON.stringify(response.data.user.token));
      
      toast.success("Login SuccessFful")
      navigate('/Home');
      alert("Login Successful")
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check credentials!");
    }
    }
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center px-4 text-white" 
    style={{
        backgroundImage: `url(${Image})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <div className="bg-black bg-opacity-0 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl max-w-md w-full p-8 ">
        <h2 className="text-center text-3xl font-extrabold text-white mb-6">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block  font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-white font-semibold mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:ring-purple-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:ring-purple-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a secure password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none text-black focus:ring-2 focus:ring-purple-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="text-white text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white font-bold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-white">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-semibold hover:underline focus:outline-none"
            aria-label={isLogin ? 'Switch to sign up' : 'Switch to login'}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

