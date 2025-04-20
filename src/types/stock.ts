// Types related to stock information
export interface Stock {
  ticker: string;
  quantity: number;
  avgPrice: number;
}

// Stock API response types
export interface StockApiSuccessResponse {
  valid: true;
  info: unknown; // Yahoo finance response type
}

export interface StockApiErrorResponse {
  valid: false;
  error: unknown;
}

// Define types for Yahoo Finance search results

// Base interface for all quote types
interface BaseQuoteResult {
  isYahooFinance?: boolean;
}

// For standard equity/stock results
interface StockResult extends BaseQuoteResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  typeDisp?: string;
  exchDisp?: string;
  sector?: string;
  industry?: string;
  // Add other potential properties from Yahoo Finance API
}

// For non-Yahoo Finance results that lack symbol
interface NonYahooFinanceResult extends BaseQuoteResult {
  isYahooFinance: false;
  index: string;
  name: string;
  permalink: string;
}

// Union type to accommodate all possible result structures
export type QuoteResult = StockResult | NonYahooFinanceResult;

// For backward compatibility with existing code in SearchBar.tsx
export type SearchResult = QuoteResult;

// The actual search response data
export interface SearchResponseData {
  quotes: QuoteResult[];
}

// Live price types
export interface LivePriceData {
  price: number | null;
  currency: string | null;
}

export interface LivePricesMap {
  [ticker: string]: LivePriceData | undefined;
}