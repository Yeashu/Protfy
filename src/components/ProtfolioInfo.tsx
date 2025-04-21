"use client"
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { getLivePrice } from '../lib/stockUtils'
import type { LivePricesMap } from '@/types/stock'

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
      const prices: LivePricesMap = {}
      for (const stock of stocks) {
        // Assuming getLivePrice now returns { price: number | null, currency: string | null }
        prices[stock.ticker] = await getLivePrice(stock.ticker)
      }
      setLivePrices(prices)
    }

    fetchLivePrices()
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
    const conversionRateUSDtoINR = 85; // 1 USD = 85 INR
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

        // Convert to INR if currency is not INR (assuming USD for now)
        if (liveData.currency === 'USD') { // Or check for other non-INR currencies
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
      amount: totalAmountINR, // Amount is now in INR
      percentage: totalPercentage,
      isProfit: totalAmountINR >= 0,
      currency: 'INR', // Display currency is INR
      totalCurrentValueINR: totalCurrentValueINR // Return total current value
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
                    <span className="font-semibold text-gray-900">{stock.ticker}</span>
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
        <p className="text-gray-500 italic py-4">No stocks in portfolio. Add stocks to track your investments.</p>
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
        </div>
      )}
    </div>
  )
}

export default ProtfolioInfo
