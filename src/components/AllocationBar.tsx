"use client";
import React from "react";
import type { PositionAnalysis } from "@/types/portfolio";

function colorFromString(str: string) {
  // simple hash to color
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 50%)`;
}

export default function AllocationBar({ positions }: { positions: PositionAnalysis[] }) {
  const total = positions.reduce((s, p) => s + (p.weightPercent || 0), 0) || 100;
  return (
    <div className="w-full">
      <div className="flex h-3 w-full overflow-hidden rounded">
        {positions
          .filter((p) => (p.weightPercent || 0) > 0.2)
          .map((p) => (
            <div
              key={p.ticker}
              title={`${p.ticker}: ${p.weightPercent.toFixed(2)}%`}
              style={{ width: `${(p.weightPercent / total) * 100}%`, backgroundColor: colorFromString(p.ticker) }}
            />
          ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-sm">
        {positions
          .filter((p) => (p.weightPercent || 0) > 0.2)
          .map((p) => (
            <div key={p.ticker} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: colorFromString(p.ticker) }} />
              <span>{p.ticker}</span>
              <span className="text-gray-500">{p.weightPercent.toFixed(2)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}
