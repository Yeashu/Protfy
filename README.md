# Protfy - Portfolio Management Application

A smart portfolio tracking and analysis tool that helps investors manage their stock investments with AI-powered insights.

## Features

- **Stock Search**: Find stocks from global markets using Yahoo Finance data
- **Portfolio Tracking**: Add stocks to your portfolio and track their performance
- **Live Price Updates**: Monitor current prices and changes in your holdings
- **Portfolio Analysis**: Get AI-powered analysis of your investment strategy

## Model & Hosting Notes
Vercel limits server function execution duration to short time windows which may prevent using larger, slower models in hosted builds. For the best analysis, run the project locally (or on a server you control) and use your own API key with a stronger model.

This repository defaults to using "Gemini 2.5 Flash-Lite" as the recommended model in the analysis route (`src/app/api/analyse/protfolio/route.ts`). You can change the model string there to any other model you have access to.

Recommendation: provide your own API key and prefer higher-capability models (for example, Gemini 2.5 Flash-Lite or newer) for more accurate and detailed portfolio analysis.

## Getting Started

Clone the repository:

```bash
git clone git@github.com:Yeashu/Protfy.git
cd Protfy
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Setup

You'll need the following environment variables:

```
GEMINI_API_KEY=your_gemini_api_key
```

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- Yahoo Finance API
 - Google Gemini AI

## Development

This project uses:
- Modern React with hooks and context API for state management
- Component-based architecture with reusable UI elements
- Next.js API routes for backend functionality

## Deployment
[protfy.vercel.app](https://protfy.vercel.app/)
