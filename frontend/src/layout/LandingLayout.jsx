import React from 'react'
import Navbar from '../components/Navbar'

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#060606] overflow-x-hidden">
      <Navbar/>
      {children}
    </div>
  )
}

export default LandingLayout;
