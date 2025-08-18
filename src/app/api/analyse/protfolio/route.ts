import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type {
  PortfolioAnalysisRequest,
  PortfolioAnalysisResponse,
  AnalysisResult,
} from "@/types/portfolio";
import yahooFinance from "yahoo-finance2";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Use deterministic settings for reproducible output
const model = "gemini-2.5-flash-lite";

function isValidAnalysis(obj: unknown): obj is AnalysisResult {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (!o.portfolioSummary || !Array.isArray(o.positions)) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { portfolioData } = (await request.json()) as PortfolioAnalysisRequest;

    // Fetch stock data from Yahoo Finance directly and calculate P/L
    const enriched = await Promise.all(
      portfolioData.map(async (stock) => {
        try {
          const quote = await yahooFinance.quote(stock.ticker);

          const costBasis = stock.quantity * stock.avgPrice;
          const currentPrice = quote?.regularMarketPrice ?? null;
          const currentValue = stock.quantity * (currentPrice ?? stock.avgPrice);
          const profitLoss = currentValue - costBasis;

          return {
            ticker: stock.ticker,
            quantity: stock.quantity,
            avgPrice: stock.avgPrice,
            currentPrice,
            costBasis,
            currentValue,
            profitLoss,
            profitLossPercent: costBasis > 0 ? (profitLoss / costBasis) * 100 : 0,
          };
        } catch (error) {
          console.error(`Error fetching data for ${stock.ticker}:`, error);
          const costBasis = stock.quantity * stock.avgPrice;
          return {
            ticker: stock.ticker,
            quantity: stock.quantity,
            avgPrice: stock.avgPrice,
            currentPrice: null,
            costBasis,
            currentValue: 0,
            profitLoss: 0,
            profitLossPercent: 0,
          };
        }
      })
    );

    const totalCost = enriched.reduce((s, p) => s + (p.costBasis || 0), 0);
    const totalValue = enriched.reduce((s, p) => s + (p.currentValue || 0), 0);
    const totalPL = totalValue - totalCost;

    // Add weight percent per position
    const enrichedWithWeight = enriched.map((p) => ({
      ...p,
      weightPercent: totalValue > 0 ? ((p.currentValue || 0) / totalValue) * 100 : 0,
    }));

    // Build a deterministic prompt asking the model to return JSON only
    const prompt = `You are an expert senior equity analyst. Return EXACTLY one JSON object matching the schema described below. DO NOT include any explanatory text.

SCHEMA:
{
  "portfolioSummary": { "totalCost": number, "totalValue": number, "totalProfitLoss": number, "healthScore": number | null, "diversificationScore": number | null },
  "positions": [{ "ticker": string, "quantity": number, "avgPrice": number, "currentPrice": number | null, "costBasis": number, "currentValue": number, "profitLoss": number, "profitLossPercent": number, "weightPercent": number, "rating": number | null, "bullets": string[], "suggestedAction": string }],
  "suggestions": [{"title": string, "detail": string}],
  "diagnostics": {"model": string, "promptHash": string}
}

Portfolio data (precomputed fields provided):
${JSON.stringify({ portfolioSummary: { totalCost, totalValue, totalPL }, positions: enrichedWithWeight }, null, 2)}

Please produce the JSON following the schema. Use rating scale 0-5 for each position. Provide concise bullet points per position (max 4 bullets). Provide up to 3 succinct portfolio-level suggestions. Keep strings short. If you cannot compute a rating, set it to null.
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      // consider using lower temperature for deterministic output
    });

    // Try to parse the model output as JSON
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(response.text);
    } catch {
      // Attempt to extract a JSON substring
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }
    }

    if (isValidAnalysis(parsed)) {
      // Ensure diagnostics exist
      if (!parsed.diagnostics || typeof parsed.diagnostics !== "object") {
        parsed.diagnostics = { model };
      } else if (!parsed.diagnostics.model) {
        parsed.diagnostics.model = model;
      }

      const result: AnalysisResult = parsed;

      return NextResponse.json<PortfolioAnalysisResponse>({ analysis: result });
    }

    // Fallback: construct a minimal AnalysisResult using computed metrics
    const fallback: AnalysisResult = {
      portfolioSummary: {
        totalCost,
        totalValue,
        totalProfitLoss: totalPL,
        healthScore: null,
        diversificationScore: null,
      },
      positions: enrichedWithWeight.map((p) => ({
        ticker: p.ticker,
        quantity: p.quantity,
        avgPrice: p.avgPrice,
        currentPrice: p.currentPrice,
        costBasis: p.costBasis,
        currentValue: p.currentValue,
        profitLoss: p.profitLoss,
        profitLossPercent: p.profitLossPercent,
        weightPercent: p.weightPercent,
        rating: null,
        bullets: [],
        suggestedAction: "",
      })),
      suggestions: [],
      raw: response.text,
      diagnostics: { model, promptHash: undefined },
    };

    return NextResponse.json<PortfolioAnalysisResponse>({ analysis: fallback });
  } catch (error) {
    console.error("Error analyzing portfolio with Gemini:", error);
    return NextResponse.json<PortfolioAnalysisResponse>(
      {
        analysis: undefined,
        error: "Failed to analyze portfolio",
      },
      { status: 500 }
    );
  }
}
