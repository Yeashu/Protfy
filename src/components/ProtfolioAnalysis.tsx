"use client";
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { getPortfolioAnalysis } from '@/lib/stockUtils';
import { PortfolioContext } from '@/context/ProtfolioContext';
import type { AnalysisResult } from '@/types/portfolio';
import AllocationBar from './AllocationBar';

function ProtfolioAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
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

          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => {
                if (!analysis) return;
                const text = JSON.stringify(analysis, null, 2);
                navigator.clipboard.writeText(text).catch(() => {});
              }}
              className="px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-900 text-sm"
            >
              Copy JSON
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-white rounded shadow">
              <h4 className="font-semibold">Total Value</h4>
              <p className="text-lg">{analysis.portfolioSummary.totalValue?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow">
              <h4 className="font-semibold">Total Cost</h4>
              <p className="text-lg">{analysis.portfolioSummary.totalCost?.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow">
              <h4 className="font-semibold">Profit / Loss</h4>
              <p className="text-lg">{analysis.portfolioSummary.totalProfitLoss?.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Allocation</h4>
            <AllocationBar positions={analysis.positions} />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-2 py-2">Ticker</th>
                  <th className="px-2 py-2">Qty</th>
                  <th className="px-2 py-2">Avg</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">P/L</th>
                  <th className="px-2 py-2">P/L %</th>
                  <th className="px-2 py-2">Weight %</th>
                  <th className="px-2 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {analysis.positions.map((p) => (
                  <React.Fragment key={p.ticker}>
                    <tr className="border-b">
                      <td className="px-2 py-2">{p.ticker}</td>
                      <td className="px-2 py-2">{p.quantity}</td>
                      <td className="px-2 py-2">{p.avgPrice?.toFixed(2)}</td>
                      <td className="px-2 py-2">{p.currentPrice !== null ? p.currentPrice.toFixed(2) : '—'}</td>
                      <td className="px-2 py-2">{p.profitLoss?.toFixed(2)}</td>
                      <td className="px-2 py-2">{p.profitLossPercent?.toFixed(2)}%</td>
                      <td className="px-2 py-2">{p.weightPercent?.toFixed(2)}%</td>
                      <td className="px-2 py-2">{p.rating ?? '—'}</td>
                    </tr>
                    {(p.bullets && p.bullets.length > 0) || p.suggestedAction ? (
                      <tr className="bg-white/70">
                        <td colSpan={8} className="px-3 py-3">
                          {p.bullets && p.bullets.length > 0 && (
                            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-800">
                              {p.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
                          {p.suggestedAction && (
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">Action:</span> {p.suggestedAction}
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Suggestions</h4>
              <ul className="list-disc pl-6">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="mb-1">
                    <strong>{s.title}:</strong> {s.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.raw && (
            <div className="mt-4 p-3 bg-white rounded">
              <h4 className="font-semibold mb-2">Model Raw Output (collapsed)</h4>
              <details>
                <summary className="cursor-pointer">Show raw</summary>
                <pre className="whitespace-pre-wrap mt-2 text-sm">{analysis.raw}</pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProtfolioAnalysis;