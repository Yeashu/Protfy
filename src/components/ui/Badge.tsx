"use client";
import React from "react";

export default function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "green" | "yellow" | "red" | "blue" }) {
  const colors: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${colors[color]}`}>{children}</span>;
}
