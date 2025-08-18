"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export default function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  const base = "rounded-md font-medium transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  } as const;
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow",
    secondary: "border border-gray-300 hover:bg-gray-100 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow",
    ghost: "text-gray-700 hover:bg-gray-100",
  } as const;
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}
