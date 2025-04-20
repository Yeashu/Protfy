import type {
  StockApiSuccessResponse,
  StockApiErrorResponse,
  Stock,
  SearchResponseData,
  SearchResult,
  LivePriceData,
} from "@/types/stock";
import type {
  PortfolioAnalysisRequest,
  PortfolioAnalysisResponse,
} from "@/types/portfolio";

const search = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(`/api/search?q=${query}`);
    const searchResult = (await response.json()) as SearchResponseData;
    return searchResult.quotes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const validateTicker = async (ticker: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/stock/${ticker}`);
    const data = (await response.json()) as
      | StockApiSuccessResponse
      | StockApiErrorResponse;
    return data.valid;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getLivePrice = async (ticker: string): Promise<LivePriceData> => {
  try {
    const response = await fetch(`/api/stock/${ticker}`);
    const data = (await response.json()) as
      | StockApiSuccessResponse
      | StockApiErrorResponse;

    // Type guard to ensure we have a valid response with the expected structure (type gymnastic)
    if (
      data.valid &&
      "info" in data &&
      typeof data.info === "object" &&
      data.info !== null &&
      "regularMarketPrice" in data.info &&
      "currency" in data.info
    ) {
      return {
        price: data.info.regularMarketPrice as number,
        currency: data.info.currency as string,
      };
    }

    console.error(
      `Error fetching live price for ${ticker}: Invalid or missing data`
    );
    return { price: null, currency: null };
  } catch (error) {
    console.error(`Error fetching live price for ${ticker}: ${error}`);
    return { price: null, currency: null };
  }
};

const getPortfolioAnalysis = async (stocks: Stock[]): Promise<string> => {
  try {
    const response = await fetch("/api/analyse/protfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolioData: stocks,
      } as PortfolioAnalysisRequest),
    });

    const data = (await response.json()) as PortfolioAnalysisResponse;

    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze portfolio");
    }

    return data.analysis || "No analysis available";
  } catch (error) {
    console.error(`Error analyzing portfolio: ${error}`);
    throw error;
  }
};

export { validateTicker, getLivePrice, getPortfolioAnalysis, search };
