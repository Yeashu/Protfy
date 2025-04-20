import React from 'react'
import NavBar from '@/components/NavBar'
import ProtfolioAnalysis from '@/components/ProtfolioAnalysis'

function Analysis() {
  return (
    <div>
      <NavBar/>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Portfolio Analysis</h1>
        <p className="text-gray-600 mb-8">
          Analyse your investment portfolio and get actionable insights powered by AI.
        </p>
        <ProtfolioAnalysis />
      </div>
    </div>
  )
}

export default Analysis