// Types related to stock information
export interface Stock {
  ticker: string;
  quantity: number;
  avgPrice: number;
}

// Yahoo Finance Quote response type
export interface YahooFinanceQuote {
  language?: string;
  region?: string;
  quoteType?: string;
  typeDisp?: string;
  quoteSourceName?: string;
  triggerable?: boolean;
  customPriceAlertConfidence?: string;
  currency?: string;
  firstTradeDateMilliseconds?: string | Date;
  hasPrePostMarketData?: boolean;
  shortName?: string;
  longName?: string;
  corporateActions?: any[];
  regularMarketTime?: string | Date;
  exchange?: string;
  messageBoardId?: string;
  exchangeTimezoneName?: string;
  exchangeTimezoneShortName?: string;
  gmtOffSetMilliseconds?: number;
  market?: string;
  esgPopulated?: boolean;
  regularMarketChangePercent?: number;
  regularMarketPrice?: number;
  priceHint?: number;
  regularMarketChange?: number;
  regularMarketDayHigh?: number;
  regularMarketDayRange?: {
    low: number;
    high: number;
  };
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  regularMarketPreviousClose?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  fullExchangeName?: string;
  financialCurrency?: string;
  regularMarketOpen?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  fiftyTwoWeekLowChange?: number;
  fiftyTwoWeekLowChangePercent?: number;
  fiftyTwoWeekRange?: {
    low: number;
    high: number;
  };
  fiftyTwoWeekHighChange?: number;
  fiftyTwoWeekHighChangePercent?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekChangePercent?: number;
  earningsTimestamp?: string | Date;
  earningsTimestampStart?: string | Date;
  earningsTimestampEnd?: string | Date;
  earningsCallTimestampStart?: number;
  earningsCallTimestampEnd?: number;
  isEarningsDateEstimate?: boolean;
  trailingAnnualDividendRate?: number;
  trailingPE?: number;
  dividendRate?: number;
  trailingAnnualDividendYield?: number;
  dividendYield?: number;
  epsTrailingTwelveMonths?: number;
  epsForward?: number;
  epsCurrentYear?: number;
  priceEpsCurrentYear?: number;
  sharesOutstanding?: number;
  bookValue?: number;
  fiftyDayAverage?: number;
  fiftyDayAverageChange?: number;
  fiftyDayAverageChangePercent?: number;
  twoHundredDayAverage?: number;
  twoHundredDayAverageChange?: number;
  twoHundredDayAverageChangePercent?: number;
  marketCap?: number;
  forwardPE?: number;
  priceToBook?: number;
  sourceInterval?: number;
  exchangeDataDelayedBy?: number;
  averageAnalystRating?: string;
  tradeable?: boolean;
  cryptoTradeable?: boolean;
  marketState?: string;
  symbol?: string;
  lastMarket?: string;
  [key: string]: any; // Allow for additional properties that we haven't explicitly defined
}

// Stock API response types
export interface StockApiSuccessResponse {
  valid: true;
  info: YahooFinanceQuote;
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