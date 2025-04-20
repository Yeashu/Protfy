"use client";
import React, { useState, useContext, useEffect, useCallback } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPortfolioAnalysis } from '@/lib/stockUtils';
import { PortfolioContext } from '@/context/ProtfolioContext';

function ProtfolioAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { stocks } = useContext(PortfolioContext);

  const handleAnalyzePortfolio = useCallback(async () => {
    if (stocks.length === 0) {
      setError("You don't have any stocks in your portfolio to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getPortfolioAnalysis(stocks);
      setAnalysis(result);
    } catch (error) {
      console.error("Portfolio analysis error:", error);
      setError("Failed to analyze portfolio. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [stocks]);

  useEffect(() => {
    if (stocks.length > 0 && !analysis) {
      handleAnalyzePortfolio();
    }
  }, [stocks, analysis, handleAnalyzePortfolio]);

  return (
    <div className="my-8">
      {stocks.length === 0 ? (
        <div className="p-6 border rounded-md bg-gray-50">
          <p className="mb-4">
            You don&apos;t have any stocks in your portfolio yet. Add some stocks to get an AI-powered analysis.
          </p>
        </div>
      ) : (
        <div className="mb-6">
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