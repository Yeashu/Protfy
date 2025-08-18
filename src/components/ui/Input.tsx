"use client";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export default function Input({ label, hint, className = "", id, ...props }: Props) {
  const input = (
    <input
      id={id}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
  return label ? (
    <label className="block">
      <span className="block text-gray-700 mb-1">{label}</span>
      {input}
      {hint && <span className="text-xs text-gray-500 mt-1 block">{hint}</span>}
    </label>
  ) : (
    input
  );
}
