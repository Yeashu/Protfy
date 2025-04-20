import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

//remove annoying notification
yahooFinance.suppressNotices(["yahooSurvey"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  try {
    const quote = await yahooFinance.quote(ticker);

    // if the ticker is valid return stock data
    if (quote) {
      return NextResponse.json({
        valid: true,
        info: quote,
      });
    } else {
      return NextResponse.json(
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
    return NextResponse.json(
      {
        valid: false,
        error: error,
      },
      {
        status: 404,
      }
    );
  }
}
