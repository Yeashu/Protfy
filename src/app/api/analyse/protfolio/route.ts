import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { PortfolioAnalysisRequest, PortfolioAnalysisResponse } from "@/types/portfolio";
import { Stock } from "@/types/stock";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function POST(request: NextRequest) {
  try {
    const { portfolioData }: { portfolioData: Stock[] } = await request.json();

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
    return NextResponse.json(
      { error: "Failed to analyze portfolio" },
      { status: 500 }
    );
  }
}
