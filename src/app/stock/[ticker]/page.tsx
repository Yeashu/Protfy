"use client";

import NavBar from "@/components/NavBar";
import React, { useEffect, useState, use } from "react";
import { getStockInfo } from "@/lib/stockUtils";
import { YahooFinanceQuote } from "@/types/stock";
import {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
} from "@/lib/formatUtils";
import AddToProtfolio from "@/components/AddToProtfolio";
import SearchBar from "@/components/SearchBar";

const DataPoint: React.FC<{
  label: string;
  value: string | number | undefined | null;
  className?: string;
}> = ({ label, value, className }) => (
  <div
    className={`flex justify-between py-2 border-b border-gray-200 last:border-b-0 ${className}`}
  >
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-medium text-gray-900">{value ?? "N/A"}</span>
  </div>
);

function StockInfo({
  params: paramsPromise,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const params = use(paramsPromise);
  const { ticker } = params;

  const [stockData, setStockData] = useState<YahooFinanceQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStockData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getStockInfo({ ticker });
        if (result.valid) {
          setStockData(result.info);
        } else {
          setError(
            `Could not find stock information for ${ticker.toUpperCase()}`
          );
        }
      } catch (err) {
        setError("An error occurred while fetching stock data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStockData();
  }, [ticker]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              Loading stock information...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-lg font-medium">{error}</p>
          </div>
        ) : (
          stockData && (
            <div>
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stockData.longName || stockData.shortName} (
                      {stockData.symbol})
                    </h1>
                    <p className="text-sm text-gray-500">
                      {stockData.fullExchangeName} • {stockData.currency}
                    </p>
                  </div>
                  <AddToProtfolio ticker={stockData.symbol} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Price Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(
                            stockData.regularMarketPrice,
                            stockData.currency
                          )}
                        </span>
                        <span
                          className={`text-lg font-medium ${
                            stockData.regularMarketChange &&
                            stockData.regularMarketChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stockData.regularMarketChange &&
                          stockData.regularMarketChange >= 0
                            ? "+"
                            : ""}
                          {formatCurrency(
                            stockData.regularMarketChange,
                            stockData.currency
                          )}
                          (
                          {stockData.regularMarketChangePercent &&
                          stockData.regularMarketChangePercent >= 0
                            ? "+"
                            : ""}
                          {stockData.regularMarketChangePercent?.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 sm:mt-0 sm:self-end">
                        As of{" "}
                        {stockData.regularMarketTime
                          ? new Date(
                              stockData.regularMarketTime
                            ).toLocaleString()
                          : "N/A"}{" "}
                        ({stockData.exchangeTimezoneShortName})
                      </div>
                      <DataPoint
                        label="Day Range"
                        value={`${formatCurrency(
                          stockData.regularMarketDayLow,
                          stockData.currency
                        )} - ${formatCurrency(
                          stockData.regularMarketDayHigh,
                          stockData.currency
                        )}`}
                      />
                      <DataPoint
                        label="Previous Close"
                        value={formatCurrency(
                          stockData.regularMarketPreviousClose,
                          stockData.currency
                        )}
                      />
                      <DataPoint
                        label="Open"
                        value={formatCurrency(
                          stockData.regularMarketOpen,
                          stockData.currency
                        )}
                      />
                      <DataPoint
                        label="Bid / Ask"
                        value={
                          stockData.bid === 0
                            ? "Market is closed"
                            : `${formatCurrency(
                                stockData.bid,
                                stockData.currency
                              )} x ${
                                stockData.bidSize ?? "N/A"
                              } / ${formatCurrency(
                                stockData.ask,
                                stockData.currency
                              )} x ${stockData.askSize ?? "N/A"}`
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Performance
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      <DataPoint
                        label="52-Week Range"
                        value={`${formatCurrency(
                          stockData.fiftyTwoWeekLow,
                          stockData.currency
                        )} - ${formatCurrency(
                          stockData.fiftyTwoWeekHigh,
                          stockData.currency
                        )}`}
                      />
                      <DataPoint
                        label="Volume"
                        value={
                          stockData.regularMarketVolume?.toLocaleString() ??
                          "N/A"
                        }
                      />
                      <DataPoint
                        label="50-Day Average"
                        value={formatCurrency(
                          stockData.fiftyDayAverage,
                          stockData.currency
                        )}
                      />
                      <DataPoint
                        label="Avg. Volume (3M)"
                        value={
                          stockData.averageDailyVolume3Month?.toLocaleString() ??
                          "N/A"
                        }
                      />
                      <DataPoint
                        label="200-Day Average"
                        value={formatCurrency(
                          stockData.twoHundredDayAverage,
                          stockData.currency
                        )}
                      />
                      <DataPoint
                        label="Avg. Volume (10D)"
                        value={
                          stockData.averageDailyVolume10Day?.toLocaleString() ??
                          "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Valuation
                    </h2>
                    <div className="space-y-1">
                      <DataPoint
                        label="Market Cap"
                        value={formatLargeNumber(stockData.marketCap)}
                      />
                      <DataPoint
                        label="P/E Ratio (TTM)"
                        value={stockData.trailingPE?.toFixed(2)}
                      />
                      <DataPoint
                        label="Forward P/E"
                        value={stockData.forwardPE?.toFixed(2)}
                      />
                      <DataPoint
                        label="EPS (TTM)"
                        value={stockData.epsTrailingTwelveMonths?.toFixed(2)}
                      />
                      <DataPoint
                        label="Price/Book"
                        value={stockData.priceToBook?.toFixed(2)}
                      />
                      <DataPoint
                        label="Dividend Yield"
                        value={
                          stockData.dividendYield
                            ? formatPercentage(stockData.dividendYield / 100)
                            : "N/A"
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                      Analyst Rating
                    </h2>
                    <div className="space-y-1">
                      <DataPoint
                        label="Average Rating"
                        value={stockData.averageAnalystRating ?? "N/A"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default StockInfo;
