"use client"
import React, { createContext, useState } from 'react'

export type Stock = {
  ticker: string
  quantity: number
  avgPrice: number
}

type PortfolioContextType = {
  stocks: Stock[]
  addStock: (stock: Stock) => void
  count: number
}

export const PortfolioContext = createContext<PortfolioContextType>({
  stocks: [],
  addStock: () => {},
  count: 0,
})

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([])

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

  const count = stocks.length

  return (
    <PortfolioContext.Provider value={{ stocks, addStock, count }}>
      {children}
    </PortfolioContext.Provider>
  )
}
