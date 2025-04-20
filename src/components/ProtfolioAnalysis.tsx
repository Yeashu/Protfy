"use client";
import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPortfolioAnalysis } from '@/lib/stockUtils';
import { PortfolioContext } from '@/context/ProtfolioContext';

function ProtfolioAnalysis() {
  const { stocks } = useContext(PortfolioContext);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyzePortfolio = async () => {
    if (stocks.length === 0) {
      setError('No stocks in your portfolio to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Pass the stocks array to getPortfolioAnalysis
      const result = await getPortfolioAnalysis(stocks);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze portfolio. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically analyze the portfolio when the component mounts
  useEffect(() => {
    if (stocks.length > 0) {
      handleAnalyzePortfolio();
    }
  }, [stocks]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Portfolio Analysis</h2>
      
      {stocks.length === 0 ? (
        <div className="p-4 border rounded-md bg-yellow-50 mb-6">
          <p>You don't have any stocks in your portfolio yet. Add some stocks to get an analysis.</p>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Your Portfolio</h3>
          <div className="bg-gray-50 p-4 border rounded-md mb-4">
            <ul className="divide-y">
              {stocks.map((stock) => (
                <li key={stock.ticker} className="py-2">
                  <span className="font-medium">{stock.ticker}</span>: {stock.quantity} shares at ${stock.avgPrice.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleAnalyzePortfolio}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>
      )}
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {loading && (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {analysis && (
        <div className="border rounded-md p-6 bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
          <div className="whitespace-pre-line">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProtfolioAnalysis;