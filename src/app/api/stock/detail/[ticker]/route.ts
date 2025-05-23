import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import type { StockApiSuccessResponse, StockApiErrorResponse } from "@/types/stock";

//remove annoying notification
yahooFinance.suppressNotices(["yahooSurvey"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  try {
    const detailedIngsights = await yahooFinance.insights(ticker);

    // if the ticker is valid return stock data
    if (detailedIngsights) {
      return NextResponse.json<StockApiSuccessResponse>({
        valid: true,
        info: detailedIngsights,
      });
    } else {
      return NextResponse.json<StockApiErrorResponse>(
        {
          valid: false,
          error: "Invalid ticker",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    // else return error
    return NextResponse.json<StockApiErrorResponse>(
      {
        valid: false,
        error,
      },
      {
        status: 404,
      }
    );
  }
}
