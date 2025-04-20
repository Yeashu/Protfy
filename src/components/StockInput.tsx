"use client"
import React, { useState, useContext, useEffect, useRef } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { validateTicker, search } from '@/lib/stockUtils'
import type { SearchResult, Stock } from '@/types/stock'

// Component-specific types
interface StockInputProps {
  onSubmit?: () => void;
}

interface StockFormData {
  ticker: string;
  quantity: string;
  avgPrice: string;
}

interface ValidationErrors {
  ticker?: string;
  quantity?: string;
  avgPrice?: string;
}

const StockInput: React.FC<StockInputProps> = ({ onSubmit }) => {
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
      }, 500);
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
    <form className="flex flex-col gap-3 max-w-xs" onSubmit={handleSubmit}>
      <div className="relative" ref={containerRef} onBlur={handleBlur}>
        <label htmlFor="stock-ticker">Stock Ticker:</label>
        <input
          id="stock-ticker"
          type="text"
          placeholder="e.g. AAPL, HDFC.NS"
          className="border rounded px-2 py-1 ml-2 w-full"
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onFocus={handleFocus}
          autoComplete="off"
        />
        {showResults && searchResult.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            {searchResult.map((val) => {
              if (val.symbol)
                return (
                  <li
                    key={val.symbol}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleResultClick(val.symbol)}
                  >
                    {`${val.shortname || val.symbol} (${val.symbol})`}
                  </li>
                );
            })}
          </ul>
        )}
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