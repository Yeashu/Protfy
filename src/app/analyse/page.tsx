"use client";

import React from 'react'
import NavBar from '@/components/NavBar'
import ProtfolioAnalysis from '@/components/ProtfolioAnalysis'
import ProtfolioInfo from '@/components/ProtfolioInfo'

function Analysis() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Portfolio Analysis</h1>
          <p className="text-gray-600 mb-8">
            Analyse your investment portfolio and get actionable insights powered by AI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Portfolio Overview</h2>
              <ProtfolioInfo/>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Detailed Analysis</h2>
          <ProtfolioAnalysis />
        </div>
      </div>
    </div>
  )
}

export default Analysis