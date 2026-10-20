import React from 'react'
import Menu from "../Menu/Menu"
import Myself from '../Myself/Myself'
import Skills from '../Skills/Skills'
import Projects from '../Projects/Projects'
import Certifications from '../Certifications/Certifications'
import AboutMe from '../AboutMe/AboutMe'
import TechBackground from '../TechBackground/TechBackground'

function StartPage() {
  return (
    <>
      <TechBackground />
      <Menu />
      <div className='page'>
        <Myself />
        <Skills />
        <Projects />
        <Certifications />
        <AboutMe />
      </div>
    </>
  )
}

export default StartPage