// import React, { useEffect } from 'react'
// import "./Menu.css"
// import {gsap} from "gsap"
// function Menu() {
//     useEffect(()=>{
//         gsap.from(".header",{
//             y:-200,
//             opacity:0,
//             duration:1.5,
//         })
//     },[])
//   return (
//     <>
//     <div className='menuCont'>
//     <ul className='statusBar'>

//         <li className='header'>
//             <b>Home</b>
//         </li>
//         <li className='header'>
//             <b>Projects</b>
//         </li >
//         <li className='header'>
//             <b>Certifications</b>
//         </li>
//         <li className='header'>
//             <b>About me</b>
//         </li>

//     </ul>

//     </div>
//     </>
//   )
import React, { useEffect, useState, useRef } from 'react'
import "./Menu.css"
import { gsap } from "gsap"
import { FaHome, FaLayerGroup, FaCertificate, FaUser } from 'react-icons/fa'

function Menu() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [activeSection, setActiveSection] = useState('home');
  const itemsRef = useRef([]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop Entrance Animation
  useEffect(() => {
    if (!isMobile) {
      gsap.fromTo(".statusBar .header",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
      );
    } else {
      // Mobile Entrance
      gsap.fromTo(".mobile-menu",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
    }
  }, [isMobile]);

  // Active Section Tracker (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 }); // 50% visible triggers change

    const sections = ['home', 'projects', 'certifications', 'aboutme'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const menuItems = [
    { name: "Home", id: "home", icon: <FaHome /> },
    { name: "Projects", id: "projects", icon: <FaLayerGroup /> },
    { name: "Certs", id: "certifications", icon: <FaCertificate /> },
    { name: "Connect", id: "aboutme", icon: <FaUser /> }
  ]

  const handleMenuItemClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className='menu-container'>
      {isMobile ? (
        <div className="mobile-menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`mobile-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <div className="icon">{item.icon}</div>
              <span className="label">{item.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <ul className='statusBar'>
          {menuItems.map((item, index) => (
            <li
              className={`header ${activeSection === item.id ? 'active' : ''}`}
              key={index}
              ref={(el) => (itemsRef.current[index] = el)}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <b>{item.name === "Connect" ? "About me" : item.name === "Certs" ? "Certifications" : item.name}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Menu