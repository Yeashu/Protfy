import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PortfolioProvider } from "@/context/ProtfolioContext";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Protfy",
  description: "A smart portfolio tracking and analysis tool that helps investors manage their stock investments with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PortfolioProvider>
          <ToastProvider>
            {children}
            <footer className="border-t border-gray-200 bg-white text-gray-600 text-sm mt-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p>
                  Information provided by Protfy is for educational purposes only and does not constitute financial advice. Markets are risky; do your own research.
                </p>
              </div>
            </footer>
          </ToastProvider>
        </PortfolioProvider>
      </body>
    </html>
  );
}
