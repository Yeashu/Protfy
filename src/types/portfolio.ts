// Types for portfolio context and analysis

import { Stock } from './stock';

export interface PortfolioContextType {
  stocks: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (ticker: string) => void;
  count: number;
}

export interface PortfolioAnalysisResponse {
  analysis: string | undefined;
}

export interface PortfolioAnalysisRequest {
  portfolioData: Stock[];
}