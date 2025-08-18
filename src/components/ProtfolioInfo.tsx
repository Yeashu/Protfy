"use client"
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { getLivePrice } from '../lib/stockUtils'
import type { LivePricesMap } from '@/types/stock'
import Link from 'next/link'

// Component-specific types
interface ProfitLossResult {
  amount: number | null;
  percentage: number | null;
  isProfit?: boolean;
}

interface TotalProfitLoss {
  amount: number;
  percentage: number;
  isProfit: boolean;
  totalCurrentValueINR: number; // Add total current value
}

const ProtfolioInfo: React.FC = () => {
  const { stocks, count, removeStock } = useContext(PortfolioContext)
  const [livePrices, setLivePrices] = useState<LivePricesMap>({})

  useEffect(() => {
    const fetchLivePrices = async () => {
      if (stocks.length === 0) {
        setLivePrices({});
        return;
      }
      try {
        const tickers = stocks.map((s) => s.ticker);
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tickers }),
        });
        if (!res.ok) throw new Error('Failed to load quotes');
        const data = (await res.json()) as Record<string, LivePricesMap[string]>;
        const mapped: LivePricesMap = {};
        for (const t of tickers) mapped[t] = data[t];
        setLivePrices(mapped);
  } catch {
        // fallback to individual calls on error
        const prices: LivePricesMap = {}
        for (const stock of stocks) {
          prices[stock.ticker] = await getLivePrice(stock.ticker)
        }
        setLivePrices(prices)
      }
    };
    fetchLivePrices();
  }, [stocks])

  // Helper function to format currency
  const formatCurrency = (value: number | null, currency: string | null): string => {
    if (value === null || value === undefined) return 'N/A';
    const symbol = currency === 'INR' ? '₹' : '$'; 
    return `${symbol}${value.toFixed(2)}`;
  };

  const calculateProfitLoss = (avgPrice: number, livePrice: number | null, quantity: number): ProfitLossResult => {
    if (livePrice === null) return { amount: null, percentage: null };
    
    const amount = (livePrice - avgPrice) * quantity;
    const percentage = avgPrice !== 0 ? ((livePrice - avgPrice) / avgPrice) * 100 : 0; // Avoid division by zero
    
    return { 
      amount, 
      percentage,
      isProfit: amount >= 0
    };
  };

  // Calculate total profit/loss and current value across all stocks, converting to INR
  const totalProfitLoss = useMemo<TotalProfitLoss & { currency: string | null }>(() => {
    const conversionRateUSDtoINR = 85; // approx
    let totalAmountINR = 0;
    let totalInvestmentINR = 0;
    let totalCurrentValueINR = 0; // Initialize total current value

    stocks.forEach(stock => {
      const liveData = livePrices[stock.ticker];
      if (liveData?.price !== null && liveData?.price !== undefined && liveData.currency) {
        const investmentAmount = stock.avgPrice * stock.quantity;
        const currentValue = liveData.price * stock.quantity;

        let investmentAmountINR = investmentAmount;
        let currentValueINR = currentValue;

  // Convert to INR if currency is USD; otherwise assume INR for now
  if (liveData.currency === 'USD') {
          investmentAmountINR = investmentAmount * conversionRateUSDtoINR;
          currentValueINR = currentValue * conversionRateUSDtoINR;
        }
        // Add more currency conversions here if needed
        // else if (liveData.currency === 'EUR') { ... }

        totalAmountINR += currentValueINR - investmentAmountINR;
        totalInvestmentINR += investmentAmountINR;
        totalCurrentValueINR += currentValueINR; // Accumulate current value in INR
      }
    });

    const totalPercentage = totalInvestmentINR > 0 ? (totalAmountINR / totalInvestmentINR) * 100 : 0;

    return {
      amount: totalAmountINR,
      percentage: totalPercentage,
      isProfit: totalAmountINR >= 0,
      currency: 'INR',
      totalCurrentValueINR: totalCurrentValueINR
    };
  }, [stocks, livePrices]);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Portfolio Summary</h2>
      <div className="mb-3 text-gray-700">Total Stocks: <span className="font-medium">{count}</span></div>
      {stocks.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {stocks.map((stock, idx) => {
            const liveData = livePrices[stock.ticker];
            const profitLoss = liveData?.price !== null && liveData?.price !== undefined
              ? calculateProfitLoss(stock.avgPrice, liveData.price, stock.quantity)
              : null;
            const stockDisplayCurrency = liveData?.currency ?? null; 
              
            return (
              <div key={idx} className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <Link href={`/stock/${stock.ticker}`}>
                      <span className="font-semibold text-blue-600 hover:underline cursor-pointer">{stock.ticker}</span>
                    </Link>
                    <span className="text-sm text-gray-600">Qty: {stock.quantity}</span>
                    <span className="text-sm text-gray-600">Avg: {formatCurrency(stock.avgPrice, stockDisplayCurrency)}</span>
                    {liveData !== undefined && (
                      <span className="text-sm">
                        Live: {formatCurrency(liveData.price, stockDisplayCurrency)}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => removeStock(stock.ticker)} 
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-xs font-medium transition-colors duration-150"
                  >
                    Remove
                  </button>
                </div>
                
                {profitLoss && profitLoss.amount !== null && (
                  <div className={`text-sm ${profitLoss.isProfit ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    P/L: {formatCurrency(profitLoss.amount, stockDisplayCurrency)} 
                    <span className="ml-1">
                      ({profitLoss.isProfit ? '+' : ''}{profitLoss.percentage && profitLoss.percentage.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-700">
          <p className="mb-3">Your portfolio is empty. Add your first position to get started.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#add-stock" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md inline-block">Add a stock</a>
            <button className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md">Import from CSV (coming soon)</button>
          </div>
        </div>
      )}
      
      {/* Display total profit/loss and current value */}
      {stocks.length > 0 && Object.keys(livePrices).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="font-semibold mb-2 text-gray-800">Total Portfolio (INR):</div>
          {/* Display Current Portfolio Value */}
          <div className="text-sm mb-1 font-bold flex justify-between">
            <span>Current Value:</span>
            <span>{formatCurrency(totalProfitLoss.totalCurrentValueINR, totalProfitLoss.currency)}</span>
          </div>
          {/* Display Total P/L */}
          <div className={`text-sm flex justify-between ${totalProfitLoss.isProfit ? 'text-green-600' : 'text-red-600'} font-bold`}>
            <span>Total P/L:</span>
            <span>
              {formatCurrency(totalProfitLoss.amount, totalProfitLoss.currency)}
              <span className="ml-1">
                ({totalProfitLoss.isProfit ? '+' : ''}{totalProfitLoss.percentage && totalProfitLoss.percentage.toFixed(2)}%)
              </span>
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            USD values converted to INR at an approximate rate of 85. This is a rough estimate.
          </div>
        </div>
      )}
    </div>
  )
}

export default ProtfolioInfo
