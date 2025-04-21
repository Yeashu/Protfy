import React from 'react'
import NavBar from '@/components/NavBar'

function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About Protfy</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            Protfy is an advanced investment portfolio analysis tool powered by AI. Our platform helps investors analyze, optimize, and monitor their portfolios with intelligent insights and data-driven recommendations. Whether you&apos;re a beginner or a seasoned investor, Protfy empowers you to make smarter investment decisions and achieve your financial goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About