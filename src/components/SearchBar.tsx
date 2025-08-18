"use client";
import React, { useEffect, useRef, useState } from "react";
import { search } from "@/lib/stockUtils";
import type { SearchResult } from "@/types/stock";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search stocks... (Name / Ticker)",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const timer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(timer.current as number | undefined);
    if (query.trim() !== "" && showResults) {
      timer.current = window.setTimeout(async () => {
        const searchResults = await search(query);
        setResult(searchResults);
      }, 200);
    } else {
      setResult([]); // Clear results if query is empty or results are hidden
    }
  
    return () => clearTimeout(timer.current as number | undefined);
  }, [query, showResults]);

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
  const router = useRouter();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const items = result.filter((val): val is Extract<SearchResult, { symbol: string }> => 'symbol' in val);
    if (activeIndex >= 0 && activeIndex < items.length) {
      router.push(`/stock/${items[activeIndex].symbol}`);
      setShowResults(false);
      return;
    }
    if (query.trim()) router.push(`/stock/${query.trim()}`);
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showResults) return;
    const items = result.filter((val): val is Extract<SearchResult, { symbol: string }> => 'symbol' in val);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(items.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1));
    } else if (e.key === 'Enter') {
      // Let form submit handle routing based on activeIndex
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  return (
    <form
      className={`flex items-center gap-3 w-full ${className}`}
      onSubmit={submit}
      role="search"
    >
      <div
        className="relative flex-grow"
        ref={containerRef}
        onBlur={handleBlur}
      >
        <input
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={onKeyDown}
          type="text"
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={showResults}
          aria-controls="search-results-listbox"
        />
        {/* Conditionally render results */}
        {showResults && result.length > 0 && (
          <ul
            id="search-results-listbox"
            role="listbox"
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {result.map((val, idx) => {
              // Only render items that have a symbol property (StockResult type)
              if ('symbol' in val) {
                return (
                  <li key={val.symbol} role="option" aria-selected={activeIndex === idx}>
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); }}
                      onClick={() => { setShowResults(false); router.push(`/stock/${val.symbol}`); }}
                      className={`w-full text-left px-4 py-2 transition-colors duration-150 ${activeIndex === idx ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                    >
                      {`${val.shortname || val.longname || val.symbol} (${val.symbol})`}
                    </button>
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 shadow"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
