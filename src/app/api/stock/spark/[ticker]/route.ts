import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

// Basic suppression for extraneous notices
yahooFinance.suppressNotices(["yahooSurvey"]);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  try {
    const now = Date.now();
    const period1 = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const res = await yahooFinance.chart(ticker, { period1, interval: "1d", return: "array" as const });
    type Quote = { close?: number; date?: Date; timestamp?: number };
    const series = (Array.isArray(res) ? (res as Quote[]) : [])
      .filter((q) => typeof q.close === 'number' && (q.date instanceof Date || typeof q.timestamp === 'number'))
      .map((q) => ({ x: new Date(q.date ?? (q.timestamp! * 1000)).getTime(), y: q.close as number }));
    const response = NextResponse.json({ points: series });
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=180, stale-while-revalidate=60");
    return response;
  } catch (error) {
    return NextResponse.json({ points: [], error: String(error) }, { status: 200 });
  }
}
