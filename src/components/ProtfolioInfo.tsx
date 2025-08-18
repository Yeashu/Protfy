"use client"
import React, { useContext, useMemo, useState } from 'react'
import { PortfolioContext } from '../context/ProtfolioContext'
// import { getLivePrice } from '../lib/stockUtils'
// import type { LivePricesMap } from '@/types/stock'
import Link from 'next/link'
import { useQuotes } from '@/lib/hooks/useQuotes'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/context/ToastContext'

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
  const { stocks, count, removeStock, updateStock } = useContext(PortfolioContext)
  const tickers = stocks.map(s => s.ticker);
  const { data: livePrices } = useQuotes(tickers);
  const { show } = useToast();
  const [confirmTicker, setConfirmTicker] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editAvg, setEditAvg] = useState<number>(0);

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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(stock.ticker);
                        setEditQty(stock.quantity);
                        setEditAvg(stock.avgPrice);
                      }}
                    >Edit</Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmTicker(stock.ticker)}
                    >Remove</Button>
                  </div>
                </div>
                {editing === stock.ticker && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Quantity"
                      type="number"
                      min={1}
                      value={editQty}
                      onChange={(e) => setEditQty(Number(e.target.value))}
                    />
                    <Input
                      label="Avg Price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={editAvg}
                      onChange={(e) => setEditAvg(Number(e.target.value))}
                    />
                    <div className="flex items-end gap-2">
                      <Button
                        onClick={() => {
                          if (editQty > 0 && editAvg >= 0) {
                            updateStock(stock.ticker, { quantity: editQty, avgPrice: editAvg });
                            setEditing(null);
                            show('Position updated', 'success');
                          } else {
                            show('Enter a valid quantity (> 0) and average price (>= 0).', 'error');
                          }
                        }}
                      >Save</Button>
                      <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
                
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
      <ConfirmDialog
        open={!!confirmTicker}
        onCancel={() => setConfirmTicker(null)}
        onConfirm={() => {
          if (confirmTicker) {
            removeStock(confirmTicker);
            show('Stock removed from portfolio', 'success');
          }
          setConfirmTicker(null);
        }}
        title="Remove position?"
        description="This will remove the stock from your portfolio. You can add it back later."
        confirmText="Remove"
      />
    </div>
  )
}

export default ProtfolioInfo
