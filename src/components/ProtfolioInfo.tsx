"use client"
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { getLivePrice } from '../lib/stockUtils'
import type { LivePriceData, LivePricesMap } from '@/types/stock'

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

  // Calculate total profit/loss across all stocks, converting to INR
  const totalProfitLoss = useMemo<TotalProfitLoss & { currency: string | null }>(() => {
    const conversionRateUSDtoINR = 85; // 1 USD = 85 INR
    let totalAmountINR = 0;
    let totalInvestmentINR = 0;
    
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
      }
    });
    
    const totalPercentage = totalInvestmentINR > 0 ? (totalAmountINR / totalInvestmentINR) * 100 : 0;
    
    return {
      amount: totalAmountINR, // Amount is now in INR
      percentage: totalPercentage,
      isProfit: totalAmountINR >= 0,
      currency: 'INR' // Display currency is INR
    };
  }, [stocks, livePrices]);

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-lg font-bold mb-2">Portfolio Info</h2>
      <div>Total Stocks: {count}</div>
      <ul className="mt-2">
        {stocks.map((stock, idx) => {
          const liveData = livePrices[stock.ticker];
          const profitLoss = liveData?.price !== null && liveData?.price !== undefined
            ? calculateProfitLoss(stock.avgPrice, liveData.price, stock.quantity)
            : null;
          const stockDisplayCurrency = liveData?.currency ?? null; 
            
          return (
            <li key={idx} className="mb-2 flex flex-col border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  {/* Display individual stock avg price and live price in their original currency */}
                  <span className="font-semibold">{stock.ticker}</span> - Qty: {stock.quantity}, Avg Price: {formatCurrency(stock.avgPrice, stockDisplayCurrency)} 
                  {liveData !== undefined && (
                    <span className="ml-2">
                      Live: {formatCurrency(liveData.price, stockDisplayCurrency)} 
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => removeStock(stock.ticker)} 
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>
              
              {profitLoss && profitLoss.amount !== null && (
                <div className={`text-sm mt-1 ${profitLoss.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                   {/* Display individual P/L in the stock's original currency */}
                  P/L: {formatCurrency(profitLoss.amount, stockDisplayCurrency)} 
                  <span className="ml-1">
                    ({profitLoss.isProfit ? '+' : ''}{profitLoss.percentage && profitLoss.percentage.toFixed(2)}%)
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      {/* Display total profit/loss */}
      {stocks.length > 0 && Object.keys(livePrices).length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <div className="font-semibold">Total Portfolio (INR):</div> {/* Indicate display currency */}
          <div className={`text-sm mt-1 ${totalProfitLoss.isProfit ? 'text-green-600' : 'text-red-600'} font-bold`}>
             {/* Use formatCurrency with the calculated INR amount and 'INR' currency */}
            Total P/L: {formatCurrency(totalProfitLoss.amount, totalProfitLoss.currency)} 
            <span className="ml-1">
              ({totalProfitLoss.isProfit ? '+' : ''}{totalProfitLoss.percentage && totalProfitLoss.percentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProtfolioInfo
