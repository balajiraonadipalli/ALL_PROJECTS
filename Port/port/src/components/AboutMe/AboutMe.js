import React from 'react'
import "./AboutMe.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiLeetcode } from "react-icons/si";
import {
  faLinkedin, faInstagram, faGithub,
  faHackerrank
} from '@fortawesome/free-brands-svg-icons';
function AboutMe() {

  return (
    <>
      <div className='AboutMeCont' id='aboutme'>
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Connect With Me</h1>
        </div>
        <a href='https://www.linkedin.com/in/balajiraonadipalli/' target="_blank"
          rel="noopener noreferrer">
          <div class="AboutMecards" data-aos="zoom-in" >
            <FontAwesomeIcon icon={faLinkedin} size="4x" className='link' />
          </div>
        </a>
        <a href='https://www.instagram.com/balajibalu709/' target="_blank"
          rel="noopener noreferrer">
          <div class="AboutMecards" data-aos="zoom-out">
            <FontAwesomeIcon icon={faInstagram} size="4x" className='insta' />
          </div>
        </a>
        <a href='https://www.hackerrank.com/profile/22331A05B0' target="_blank"
          rel="noopener noreferrer">
          <div class="AboutMecards" data-aos="zoom-in">
            <FontAwesomeIcon icon={faHackerrank} size="4x" className='hacker' />
          </div>
        </a>

        <a href='https://github.com/balajiraonadipalli' target="_blank"
          rel="noopener noreferrer">
          <div class="AboutMecards" data-aos="zoom-out">
            <FontAwesomeIcon icon={faGithub} size='4x' />
          </div>
        </a>
        <a
          href="https://leetcode.com/u/Balaji-Rao/"   /* replace with your LeetCode profile */
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="AboutMecards leetcode-card" data-aos="zoom-out" aria-label="LeetCode">
            <SiLeetcode size={48} className='hacker' />
          </div>
        </a>
      </div>
    </>
  )
}

export default AboutMe