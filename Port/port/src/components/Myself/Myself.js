import React, { useEffect } from 'react'
import './Myself.css'
import Img from "../assessts/back.png"
import { gsap } from "gsap"
function Myself() {
  useEffect(() => {
    const tl = gsap.timeline();

    // Image Reveal
    tl.from(".Imgcont", {
      scale: 0,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)"
    })

      // Intro Text
      .from(".intro-text", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")

      // Name Animation (Staggered)
      .from(".name-char", {
        y: 50,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "back.out(2)" // Bouncy effect
      }, "-=0.5")

      // Description Fade Up
      .from(".professional-desc", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2, // Stagger paragraphs
        ease: "power2.out"
      }, "-=0.5");

  }, [])

  const balaji = ["N", "A", "D", "I", "P", "A", "L", "L", "I", " ", "B", "A", "L", "A", "J", "I", " ", "R", "A", "O"]

  return (
    <>
      <div className='MyselfCont' id="home">
        <div className='Image'>
          <img src={Img} className='Imgcont' alt='ProfileImage' />
        </div>
        <div className='About'>

          <h2 className="intro-text">Hello, I'm</h2>

          <div>
            <pre>
              {
                balaji.map((x, i) => (
                  <h1 key={i} className="name-char">{x}</h1>
                ))
              }
            </pre>
          </div>

          <div className="professional-desc">
            <h1>Software Engineer & Full Stack Developer</h1>
            <p>
              I craft high-performance web applications with a focus on seamless user experiences and modern design.
              Passionate about transforming complex problems into elegant, scalable solutions.
            </p>
            <p>
              Explore my work below to see how I combine creativity with technical expertise to build digital products that matter.
            </p>
            <div className="resume-container">
              <a href="/resume.pdf" download="Balaji_Rao_Resume.pdf" className="resume-btn">
                Download Resume
              </a>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export default Myself