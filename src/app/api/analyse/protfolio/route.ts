import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import type { PortfolioAnalysisRequest, PortfolioAnalysisResponse } from "@/types/portfolio";
import yahooFinance from "yahoo-finance2";

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
const model = 'gemini-1.5-flash-8b';// lowerimg model quality due to vercel

export async function POST(request: NextRequest) {
  try {
    const { portfolioData } = (await request.json()) as PortfolioAnalysisRequest;

    // Fetch stock data from Yahoo Finance directly and calculate P/L
    const stocksWithData = await Promise.all(
      portfolioData.map(async (stock) => {
        try {
          // get stock data from yahoo
          const quote = await yahooFinance.quote(stock.ticker);
          const insight = await yahooFinance.insights(stock.ticker);
          
          // Calculate profit/loss
          const costBasis = stock.quantity * stock.avgPrice;
          const currentValue = stock.quantity * (quote.regularMarketPrice || stock.avgPrice);
          const profitLoss = currentValue - costBasis;
          
          return {
            ...stock,
            insight,
            costBasis,
            currentValue,
            profitLoss,
            profitLossPercent: costBasis > 0 ? (profitLoss / costBasis) * 100 : 0
          };
        } catch (error) {
          console.error(`Error fetching data for ${stock.ticker}:`, error);
          return {
            ...stock,
            quote: { error: `Failed to fetch data for ${stock.ticker}` },
            costBasis: stock.quantity * stock.avgPrice,
            currentValue: 0,
            profitLoss: 0,
            profitLossPercent: 0
          };
        }
      })
    );

    // Create the portfolio analysis prompt with raw quote data and P/L information
    const prompt = `
Analyze the following investment portfolio with detailed insights:

Portfolio:
${JSON.stringify(stocksWithData, null, 2)}

Please provide:
1. A comprehensive detailed analysis of each stock including strengths, weaknesses, and potential risks
2. Portfolio diversification assessment across sectors and industries
3. Recommendations for rebalancing or optimization
4. A rating for each stock on a scale of 0 to 5 (where 0 is poor and 5 is excellent)
5. An overall portfolio health score and risk assessment
6. Suggestions for potential new investments that would complement the existing portfolio
7. Pay special attention to the profit/loss (profitLoss field) of each position and include this in your analysis
Format your analysis with clear sections and bullet points where appropriate.
`;

    const response = await ai.models.generateContent({
      model: model, 
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
