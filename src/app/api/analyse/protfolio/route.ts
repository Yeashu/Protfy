import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { PortfolioAnalysisRequest, PortfolioAnalysisResponse } from "@/types/portfolio";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

export async function POST(request: NextRequest) {
  try {
    const { portfolioData }: PortfolioAnalysisRequest = await request.json();

    const prompt = ` Analyse the protfolio ${portfolioData}`;

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
