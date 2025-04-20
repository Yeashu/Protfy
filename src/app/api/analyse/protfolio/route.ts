import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type { PortfolioAnalysisRequest, PortfolioAnalysisResponse } from "@/types/portfolio";
import type { Stock } from "@/types/stock";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function POST(request: NextRequest) {
  try {
    const { portfolioData } = (await request.json()) as PortfolioAnalysisRequest;

    // Format the portfolio data for analysis
    const formattedPortfolio = portfolioData.map(stock => 
      `${stock.ticker}: ${stock.quantity} shares at $${stock.avgPrice.toFixed(2)}`
    ).join('\n');

    const prompt = `Analyse the portfolio:\n${formattedPortfolio}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    return NextResponse.json<PortfolioAnalysisResponse>({
      analysis: response.text,
    });
  } catch (error) {
    console.error("Error analyzing portfolio with Gemini:", error);
    return NextResponse.json<PortfolioAnalysisResponse>(
      { 
        analysis: undefined,
        error: "Failed to analyze portfolio" 
      },
      { status: 500 }
    );
  }
}
