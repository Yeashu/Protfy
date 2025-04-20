"use client";
import React, { useEffect, useRef, useState } from "react";
import { search } from "@/lib/stockUtils";
import type { SearchResult } from "@/types/stock";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search stocks...",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const timer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(timer.current as number | undefined);
    if (query.trim() !== "" && showResults) {
      timer.current = window.setTimeout(async () => {
        const searchResults = await search(query);
        setResult(searchResults);
      }, 500);
    } else {
      setResult([]); // Clear results if query is empty or results are hidden
    }
  
    return () => clearTimeout(timer.current as number | undefined);
  }, [query, showResults]);

  const handleResultClick = (symbol: string) => {
    setQuery(symbol);
    setResult([]);
    setShowResults(false);
  };

  const handleFocus = () => {
    setShowResults(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Hide results if focus moves outside the container
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setTimeout(() => {
        setShowResults(false);
      }, 150); // Delay to allow clicks on results
    }
  };

  return (
    <form
      className={`flex items-center gap-2 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative" ref={containerRef} onBlur={handleBlur}>
        <input
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          type="text"
          placeholder={placeholder}
          className="border rounded px-2 py-1"
          value={query}
          autoComplete="off"
        />
        {/* Conditionally render results */}
        {showResults && result.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            {result.map((val) => {
              // Only render items that have a symbol property (StockResult type)
              if ('symbol' in val) {
                return (
                  <li
                    key={val.symbol}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleResultClick(val.symbol)}
                  >
                    {`${val.shortname || val.longname || val.symbol} (${val.symbol})`}
                  </li>
                );
              }
              return null; // Skip rendering items without a symbol
            }).filter(Boolean)}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
