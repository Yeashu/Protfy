"use client";
import useSWR from "swr";

export type SparkPoint = { x: number; y: number };

export function useSparkline(ticker: string | null | undefined) {
  const key = ticker ? (["/api/stock/spark", ticker] as const) : null;
  const { data, error, isLoading } = useSWR(key, async (k: readonly [string, string]) => {
    const t = k[1];
    const res = await fetch(`/api/stock/spark/${encodeURIComponent(t)}`);
    if (!res.ok) throw new Error("sparkline fetch failed");
    const json = (await res.json()) as { points: SparkPoint[] };
    return json.points ?? [];
  }, { revalidateOnFocus: false, dedupingInterval: 30_000 });
  return { data: data ?? [], error, isLoading } as const;
}
