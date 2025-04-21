"use client"
import React, { createContext, useState, useEffect } from 'react'
import { Stock } from '@/types/stock'
import { PortfolioContextType } from '@/types/portfolio'

// Default portfolio stocks for less work for user during demo
const DEFAULT_STOCKS: Stock[] = [
  {ticker: 'ZOMATO.BO', quantity: 90, avgPrice: 64},
  {ticker: 'OFSS.BO', quantity: 7, avgPrice: 3683},
  {ticker: 'INFY.NS', quantity: 30, avgPrice: 1378},
  {ticker: 'DMART.NS', quantity: 10, avgPrice: 3730},
];

export const PortfolioContext = createContext<PortfolioContextType>({
  stocks: [],
  addStock: () => {},
  removeStock: () => {},
  count: 0,
})

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with data from localStorage if available, otherwise use default stocks
  const [stocks, setStocks] = useState<Stock[]>(() => {
    // skip if the Server Side Rendering is going on
    if (typeof window !== 'undefined') {
      const savedStocks = localStorage.getItem('portfolioStocks');
      return savedStocks ? JSON.parse(savedStocks) : DEFAULT_STOCKS;
    }
    return DEFAULT_STOCKS;
  });

  // Save to localStorage whenever stocks change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioStocks', JSON.stringify(stocks));
    }
  }, [stocks]);

  const addStock = (stock: Stock) => {
    setStocks(prev => {
      // Check if the stock already exists in the portfolio
      const existingStockIndex = prev.findIndex(
        s => s.ticker.toLowerCase() === stock.ticker.toLowerCase()
      );
      
      if (existingStockIndex !== -1) {
        // If stock exists, create a new array with the updated stock
        const existingStock = prev[existingStockIndex];
        const totalShares = existingStock.quantity + stock.quantity;
        
        // Calculate new average price: (existing shares * existing avg price + new shares * new price) / total shares
        const totalValue = (existingStock.quantity * existingStock.avgPrice) + 
                           (stock.quantity * stock.avgPrice);
        const newAvgPrice = totalValue / totalShares;
        
        // update the stock info
        const updatedStocks = [...prev];
        updatedStocks[existingStockIndex] = {
          ...existingStock,
          quantity: totalShares,
          avgPrice: newAvgPrice
        };
        
        return updatedStocks;
      } else {
        // If stock doesn't exist, add it as a new entry
        return [...prev, stock];
      }
    })
  }

  const removeStock = (ticker: string) => {
    setStocks(prev => prev.filter(stock => stock.ticker !== ticker));
  }

  const count = stocks.length

  return (
    <PortfolioContext.Provider value={{ stocks, addStock, removeStock, count }}>
      {children}
    </PortfolioContext.Provider>
  )
}
