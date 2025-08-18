"use client";
import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white p-4 sm:p-6 rounded-lg shadow ${className}`}>{children}</div>;
}
