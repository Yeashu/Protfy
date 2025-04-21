"use client"
import React, { useState, useContext, useEffect, useRef } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { validateTicker, search } from '@/lib/stockUtils'
import type { SearchResult, Stock } from '@/types/stock'

const StockInput: React.FC = () => {
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [avgPrice, setAvgPrice] = useState(0)
  const { addStock } = useContext(PortfolioContext)
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(searchTimer.current as number | undefined);
    if (ticker.trim() !== "" && showResults) {
      searchTimer.current = window.setTimeout(async () => {
        const results = await search(ticker);
        setSearchResult(results);
      }, 200);
    } else {
      setSearchResult([]);
    }
    return () => clearTimeout(searchTimer.current as number | undefined);
  }, [ticker, showResults]);

  const handleResultClick = (symbol: string) => {
    setTicker(symbol.toUpperCase());
    setSearchResult([]);
    setShowResults(false);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setTimeout(() => {
        setShowResults(false);
      }, 150);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(false);
    setSearchResult([]);

    const isValid = await validateTicker(ticker);

    if (isValid) {
      const stockToAdd: Stock = { ticker: ticker.toUpperCase(), quantity, avgPrice };
      addStock(stockToAdd)
      setTicker('')
      setQuantity(1)
      setAvgPrice(0)
    } else {
      alert("Invalid ticker symbol. Please recheck.");
    }
  }

  return (
    <form className="flex flex-col gap-4 max-w-md" onSubmit={handleSubmit}>
      <div className="relative" ref={containerRef} onBlur={handleBlur}>
        <label htmlFor="stock-ticker" className="block text-gray-700 mb-1">Stock Ticker:</label>
        <input
          id="stock-ticker"
          type="text"
          placeholder="e.g. AAPL, INFY.NS (you can use Stock Name for search)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onFocus={handleFocus}
          autoComplete="off"
        />
        {showResults && searchResult.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {searchResult.map((val) => {
              // Check if the result has a symbol property using the 'in' operator
              if ('symbol' in val) {
                return (
                  <li
                    key={val.symbol}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                    onMouseDown={() => handleResultClick(val.symbol)}
                  >
                    {`${val.shortname || val.longname || val.symbol} (${val.symbol})`}
                  </li>
                );
              }
              return null; // Skip results without symbol property
            }).filter(Boolean)}
          </ul>
        )}
      </div>
      <div>
        <label htmlFor="quantity" className="block text-gray-700 mb-1">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          placeholder="e.g. 10"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="avg-price" className="block text-gray-700 mb-1">Avg Price:</label>
        <input
          id="avg-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 150.00"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={avgPrice}
          onChange={e => setAvgPrice(Number(e.target.value))}
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-150 shadow mt-2 w-full md:w-auto md:self-start"
      >
        Add to Portfolio
      </button>
    </form>
  )
}

export default StockInput