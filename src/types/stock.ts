// Types related to stock information and tracking

export interface Stock {
  ticker: string;
  quantity: number;
  avgPrice: number;
}

export interface LivePricesMap {
  [ticker: string]: number | null;
}

export interface ProfitLossResult {
  amount: number | null;
  percentage: number | null;
  isProfit?: boolean;
}

export interface TotalProfitLoss {
  amount: number;
  percentage: number;
  isProfit: boolean;
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