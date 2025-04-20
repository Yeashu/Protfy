// Types related to stock information

export interface Stock {
  ticker: string;
  quantity: number;
  avgPrice: number;
}

// Stock API response types
export interface StockApiSuccessResponse {
  valid: true;
  info: any; // Yahoo finance response type
}

export interface StockApiErrorResponse {
  valid: false;
  error: any;
}

// Search types
export interface SearchResponseData {
  quotes: SearchResult[];
}

export interface SearchResult {
  symbol: string;
  shortname?: string;
}

// Live price types
export interface LivePriceData {
  price: number | null;
  currency: string | null;
}

export interface LivePricesMap {
  [ticker: string]: LivePriceData | undefined;
}