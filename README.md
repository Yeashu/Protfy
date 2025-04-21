# Protfy - Portfolio Management Application

A smart portfolio tracking and analysis tool that helps investors manage their stock investments with AI-powered insights.

## Features

- **Stock Search**: Find stocks from global markets using Yahoo Finance data
- **Portfolio Tracking**: Add stocks to your portfolio and track their performance
- **Live Price Updates**: Monitor current prices and changes in your holdings
- **Portfolio Analysis**: Get AI-powered analysis of your investment strategy

## Vercel Limitation
The project is currently hosted on vercel and it limits server function execution duration to 10s therefore i cannot use any high quality model for analysis
Please set up project locally and use good AI models (even gemini2.0 you can get free api) as i am limited to using old gemini 1.0 8b lowest offering by gemini.
You can change model by doing one-line edit in src/app/api/analyse/protfolio and editing const model. 

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
