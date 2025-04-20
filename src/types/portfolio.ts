// Types for portfolio context and analysis
import type { Stock } from './stock';

export interface PortfolioContextType {
  stocks: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (ticker: string) => void;
  count: number;
}

// Portfolio analysis types
export interface PortfolioAnalysisRequest {
  portfolioData: Stock[];
}

export interface PortfolioAnalysisResponse {
  analysis: string | undefined;
  error?: string;
}