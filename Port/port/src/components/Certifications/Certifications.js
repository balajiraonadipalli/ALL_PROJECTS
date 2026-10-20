import React, { useLayoutEffect, useRef } from 'react'
import './Certifications.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Images } from "../assessts/Images"

gsap.registerPlugin(ScrollTrigger);

function Certifications() {
  const component = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".CardE");

      // Initial Setup: First card visible, others hidden and pre-rotated
      gsap.set(cards, {
        autoAlpha: (i) => i === 0 ? 1 : 0,
        rotationY: (i) => i === 0 ? 0 : 90, // Others start rotated 90deg (perpendicular/hidden)
        z: (i) => i === 0 ? 0 : -100, // Slightly back
        transformOrigin: "50% 50% -50px" // Slight depth for rotation axis
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + (cards.length * 100) + "%"
        }
      });

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        // Current card rotates out to Left (-90)
        tl.to(card, {
          rotationY: -90,
          opacity: 0,
          z: -100,
          duration: 1,
          ease: "power2.inOut"
        })
          // Next card rotates in from Right (90 -> 0)
          .fromTo(cards[i + 1],
            {
              rotationY: 90,
              autoAlpha: 0,
              z: -100
            },
            {
              rotationY: 0,
              autoAlpha: 1,
              z: 0,
              duration: 1,
              ease: "power2.inOut"
            },
            "<" // Start exactly when previous starts for continuous flip
          );
      });

    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={component} className='certificationsCont' id='certifications'>
      <center style={{ position: 'absolute', top: '6rem', width: '100%', zIndex: 10 }}>
        <h1>Certifications</h1>
      </center>
      {
        Images.map((image, index) => {
          return (
            <div className="CardE" key={index}>
              <img src={image} className='ImgCard' alt='Certification' />
            </div>
          )
        })
      }
    </div>
  )
}

export default Certifications