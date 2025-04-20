"use client";
import { search } from "@/lib/stockUtils";
import React, { useEffect, useRef, useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
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
    //setQuery('');
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
      className="flex items-center gap-2"
      onSubmit={(e) => e.preventDefault()}
    >
      {" "}
      {/* Prevent default form submission for now */}
      <div className="relative" ref={containerRef} onBlur={handleBlur}>
        <input
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          type="text"
          placeholder="Search stocks..."
          className="border rounded px-2 py-1"
          value={query}
          autoComplete="off"
        />
        {/* Conditionally render results */}
        {showResults && result.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            {result.map((val) => {
              if (val.symbol)
                return (
                  <li
                    key={val.symbol}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleResultClick(val.symbol)} // Use onMouseDown
                  >
                    {`${val.shortname} (${val.symbol})`}
                  </li>
                );
            })}
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
}

export default SearchBar;
