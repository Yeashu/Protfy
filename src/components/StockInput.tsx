"use client"
import React, { useState, useContext } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { validateTicker } from '@/lib/stockUtils'
import { Stock } from '@/types/stock'

function StockInput() {
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [avgPrice, setAvgPrice] = useState(0)
  const { addStock } = useContext(PortfolioContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // check if ticker is valid
    const isValid = await validateTicker(ticker);

    if(isValid){
      const stockToAdd: Stock = { ticker, quantity, avgPrice };
      addStock(stockToAdd)
      setTicker('')
      setQuantity(1)
      setAvgPrice(0)
    } else {
      alert("Invalid ticker symbol. Please recheck.");
    }
  }

  return (
    <form className="flex flex-col gap-3 max-w-xs" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="stock-ticker">Stock Ticker:</label>
        <input
          id="stock-ticker"
          type="text"
          placeholder="e.g. AAPL, HDFC.NS (NS for National Stock Exchange India)"
          className="border rounded px-2 py-1 ml-2"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          placeholder="e.g. 10"
          className="border rounded px-2 py-1 ml-2"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="avg-price">Avg Price:</label>
        <input
          id="avg-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 150.00"
          className="border rounded px-2 py-1 ml-2"
          value={avgPrice}
          onChange={e => setAvgPrice(Number(e.target.value))}
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Add to Portfolio
      </button>
    </form>
  )
}

export default StockInput