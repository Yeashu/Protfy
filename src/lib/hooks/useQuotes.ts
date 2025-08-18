"use client";
import useSWR from "swr";
import type { LivePricesMap } from "@/types/stock";

const fetcher = async (url: string, tickers: string[]) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickers }),
  });
  if (!res.ok) throw new Error("Failed quotes fetch");
  return (await res.json()) as Record<string, { price: number | null; currency: string | null }>;
};

export function useQuotes(tickers: string[]) {
  const key = tickers.length ? ["/api/quotes", [...tickers].sort().join(",")] : null;
  const { data, error, isLoading, mutate } = useSWR(key, () => fetcher("/api/quotes", tickers), {
    revalidateOnFocus: false,
    dedupingInterval: 20_000,
  });

  const map: LivePricesMap = {};
  if (data) {
    for (const t of tickers) map[t] = data[t];
  }

  return { data: map, error, isLoading, mutate } as const;
}
