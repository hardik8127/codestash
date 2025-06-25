import React from 'react'
import Navbar from '../components/Navbar'

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-x-hidden">
      <Navbar/>
      {children}
    </div>
  )
}

export default LandingLayout;
