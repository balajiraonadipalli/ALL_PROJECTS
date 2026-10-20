import React, { useLayoutEffect, useRef } from 'react'
import './Projects.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../assessts/Images';

gsap.registerPlugin(ScrollTrigger);

function Projects() {
  const component = useRef();
  const slider = useRef();
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // DESKTOP: 3D Rotating Cylinder
      mm.add("(min-width: 769px)", () => {
        const cardCount = projects.length;
        const theta = 360 / cardCount;
        const cardWidth = 450;
        const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / cardCount));

        gsap.utils.toArray(".panel").forEach((panel, i) => {
          const angle = theta * i;
          gsap.set(panel, {
            rotationY: angle,
            z: radius,
            transformOrigin: `50% 50% -${radius}px`,
            // Reset potential mobile overrides
            xPercent: 0, left: "50%", top: "65%", margin: "-300px 50 0 -250px" // Explicitly restore if needed, or rely on revert
          });
        });

        gsap.to(slider.current, {
          rotationY: -360,
          ease: "none",
          scrollTrigger: {
            trigger: component.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: "+=3000",
          }
        });
      });

      // MOBILE: Vertical List with Alternating Slide-in Animation
      mm.add("(max-width: 768px)", () => {
        // 1. Reset Container Structure for Vertical Scroll
        gsap.set(".projects-container", {
          height: "auto",
          minHeight: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          perspective: "none",
          display: "block",
          paddingBottom: "4rem"
        });

        gsap.set(".carousel", {
          position: "relative",
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformStyle: "flat",
          gap: "40px",
          paddingTop: "70px" // Space for fixed header
        });

        // 2. Select and Animate Cards
        const panels = gsap.utils.toArray(".panel");

        panels.forEach((panel, i) => {
          // Reset Card Styles
          gsap.set(panel, {
            position: "relative",
            width: "85%", // Good responsive width
            maxWidth: "400px",
            height: "auto",
            left: "auto",
            top: "auto",
            margin: "0",
            rotationY: 0,
            z: 0,
            x: 0,
            opacity: 1
          });

          // Animation: Left for Even, Right for Odd
          const xOffset = i % 2 === 0 ? -30 : 30; // Very subtle movement

          gsap.fromTo(panel,
            {
              opacity: 0,
              x: xOffset,
              rotate: i % 2 === 0 ? -2 : 2
            },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              duration: 1.2, // Luxurious duration
              ease: "expo.out", // Softest landing
              scrollTrigger: {
                trigger: panel,
                start: "top 90%", // Start earlier
                end: "top 20%",
                toggleActions: "play none none reverse",
              }
            }
          );
        });
      });

    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={component} id='projects' style={{ position: "relative" }}>
      <center>
        <h1>Projects</h1>
      </center>
      <div className="projects-container">
        <div className="carousel" ref={slider}>
          {projects.map((project, index) => (
            <div className="panel" key={index}>
              <div className="Card">
                <center>
                  <h3>{project.title}</h3>
                </center>
                <div className="card-buttons">
                  <button onClick={() => window.open(project.url, "_blank")}>
                    Get GitHub URL
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Projects

