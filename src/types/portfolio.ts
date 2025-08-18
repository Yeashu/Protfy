// Types for portfolio context and analysis
import type { Stock } from './stock';

export interface PortfolioContextType {
  stocks: Stock[];
  addStock: (stock: Stock) => void;
  removeStock: (ticker: string) => void;
  updateStock: (ticker: string, updates: Partial<Pick<Stock, 'quantity' | 'avgPrice'>>) => void;
  count: number;
}

// Portfolio analysis request (unchanged)
export interface PortfolioAnalysisRequest {
  portfolioData: Stock[];
}

// Structured analysis types returned by the AI backend
export interface PositionAnalysis {
  ticker: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number | null;
  costBasis: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  weightPercent: number;
  rating: number | null; // 0-5
  bullets?: string[];
  suggestedAction?: string;
}

export interface PortfolioSummary {
  totalCost: number;
  totalValue: number;
  totalProfitLoss: number;
  healthScore: number | null; // 0-100
  diversificationScore: number | null; // 0-100
}

export interface AnalysisResult {
  portfolioSummary: PortfolioSummary;
  positions: PositionAnalysis[];
  suggestions?: { title: string; detail: string }[];
  raw?: string; // fallback raw text from model if needed
  diagnostics?: { model?: string; promptHash?: string };
}

export interface PortfolioAnalysisResponse {
  analysis?: AnalysisResult;
  error?: string;
}