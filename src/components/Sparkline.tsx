"use client";
import React from "react";

type Point = { x: number; y: number };

export default function Sparkline({ data, width = 120, height = 32, stroke = "#2563eb" }: { data: Point[]; width?: number; height?: number; stroke?: string }) {
  if (!data || data.length < 2) {
    return <div className="text-xs text-gray-500" aria-hidden>—</div>;
  }
  const minX = data[0].x;
  const maxX = data[data.length - 1].x;
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));
  const scaleX = (x: number) => ((x - minX) / (maxX - minX || 1)) * (width - 2) + 1;
  const scaleY = (y: number) => height - (((y - minY) / (maxY - minY || 1)) * (height - 2) + 1);
  const d = data.map((p, i) => `${i === 0 ? "M" : "L"} ${scaleX(p.x)},${scaleY(p.y)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}
