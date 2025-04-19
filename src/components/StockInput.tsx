import React from 'react'

function StockInput() {
  return (
    <form className="flex flex-col gap-3 max-w-xs">
      <div>
        <label htmlFor="stock-ticker">Stock Ticker:</label>
        <input
          id="stock-ticker"
          type="text"
          placeholder="e.g. AAPL, HDFC.NS (NS for National Stock Exchange India)"
          className="border rounded px-2 py-1 ml-2"
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