import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import type { LivePriceData } from "@/types/stock";

// Simple in-memory cache for quotes per ticker
type CacheEntry = { data: LivePriceData; ts: number };
const QUOTE_CACHE = new Map<string, CacheEntry>();
const TTL_MS = 30_000; // 30s cache

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { tickers?: string[] };
    const tickers = (body.tickers || [])
      .filter((t) => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!tickers.length) {
      return NextResponse.json(
        { error: "tickers array is required" },
        { status: 400 }
      );
    }

    const now = Date.now();
    const result: Record<string, LivePriceData> = {};

    // Determine which tickers need fetching vs cache hit
    const toFetch: string[] = [];
    for (const t of tickers) {
      const key = t.toUpperCase();
      const entry = QUOTE_CACHE.get(key);
      if (entry && now - entry.ts < TTL_MS) {
        result[t] = entry.data;
      } else {
        toFetch.push(t);
      }
    }

    if (toFetch.length) {
      // Fetch quotes for remaining tickers in parallel
      const quotes = await Promise.all(
        toFetch.map(async (t) => {
          try {
            const q = await yahooFinance.quote(t);
            const data: LivePriceData = {
              price: (q?.regularMarketPrice as number | undefined) ?? null,
              currency: (q?.currency as string | undefined) ?? null,
            };
            QUOTE_CACHE.set(t.toUpperCase(), { data, ts: Date.now() });
            return { t, data };
          } catch {
            const data: LivePriceData = { price: null, currency: null };
            QUOTE_CACHE.set(t.toUpperCase(), { data, ts: Date.now() });
            return { t, data };
          }
        })
      );

      for (const { t, data } of quotes) {
        result[t] = data;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("/api/quotes error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
