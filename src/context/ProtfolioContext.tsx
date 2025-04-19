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
    setStocks(prev => [...prev, stock])
  }

  const count = stocks.length

  return (
    <PortfolioContext.Provider value={{ stocks, addStock, count }}>
      {children}
    </PortfolioContext.Provider>
  )
}
