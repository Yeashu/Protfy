"use client"
import React, { useContext } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'

const ProtfolioInfo: React.FC = () => {
  const { stocks, count } = useContext(PortfolioContext)

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-lg font-bold mb-2">Portfolio Info</h2>
      <div>Total Stocks: {count}</div>
      <ul className="mt-2">
        {stocks.map((stock, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{stock.ticker}</span> - Qty: {stock.quantity}, Avg Price: {stock.avgPrice}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProtfolioInfo
