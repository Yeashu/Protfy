"use client"
import React, { useContext, useState, useEffect, useMemo } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
import { getLivePrice } from '../lib/stockUtils'
import { LivePricesMap, ProfitLossResult, TotalProfitLoss } from '@/types/stock'

const ProtfolioInfo: React.FC = () => {
  const { stocks, count, removeStock } = useContext(PortfolioContext)
  const [livePrices, setLivePrices] = useState<LivePricesMap>({})

  useEffect(() => {
    const fetchLivePrices = async () => {
      const prices: LivePricesMap = {}
      for (const stock of stocks) {
        prices[stock.ticker] = await getLivePrice(stock.ticker)
      }
      setLivePrices(prices)
    }

    fetchLivePrices()
  }, [stocks])

  const calculateProfitLoss = (avgPrice: number, livePrice: number | null, quantity: number): ProfitLossResult => {
    if (livePrice === null) return { amount: null, percentage: null };
    
    const amount = (livePrice - avgPrice) * quantity;
    const percentage = ((livePrice - avgPrice) / avgPrice) * 100;
    
    return { 
      amount, 
      percentage,
      isProfit: amount >= 0
    };
  };

  // Calculate total profit/loss across all stocks
  const totalProfitLoss = useMemo<TotalProfitLoss>(() => {
    let totalAmount = 0;
    let totalInvestment = 0;
    
    stocks.forEach(stock => {
      const livePrice = livePrices[stock.ticker];
      if (livePrice !== null && livePrice !== undefined) {
        const investmentAmount = stock.avgPrice * stock.quantity;
        const currentValue = livePrice * stock.quantity;
        
        totalAmount += currentValue - investmentAmount;
        totalInvestment += investmentAmount;
      }
    });
    
    const totalPercentage = totalInvestment > 0 ? (totalAmount / totalInvestment) * 100 : 0;
    
    return {
      amount: totalAmount,
      percentage: totalPercentage,
      isProfit: totalAmount >= 0
    };
  }, [stocks, livePrices]);

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-lg font-bold mb-2">Portfolio Info</h2>
      <div>Total Stocks: {count}</div>
      <ul className="mt-2">
        {stocks.map((stock, idx) => {
          const profitLoss = livePrices[stock.ticker] 
            ? calculateProfitLoss(stock.avgPrice, livePrices[stock.ticker], stock.quantity)
            : null;
            
          return (
            <li key={idx} className="mb-2 flex flex-col border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{stock.ticker}</span> - Qty: {stock.quantity}, Avg Price: ${stock.avgPrice.toFixed(2)}
                  {livePrices[stock.ticker] !== undefined && (
                    <span className="ml-2">
                      Live: ${livePrices[stock.ticker] ? livePrices[stock.ticker]?.toFixed(2) : 'N/A'}
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
                  P/L: ${profitLoss.amount.toFixed(2)} 
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
          <div className="font-semibold">Total Portfolio:</div>
          <div className={`text-sm mt-1 ${totalProfitLoss.isProfit ? 'text-green-600' : 'text-red-600'} font-bold`}>
            Total P/L: ${totalProfitLoss.amount.toFixed(2)} 
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
