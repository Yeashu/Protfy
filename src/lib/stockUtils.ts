import { StockApiSuccessResponse, StockApiErrorResponse, Stock } from '@/types/stock';
import { PortfolioAnalysisRequest, PortfolioAnalysisResponse } from '@/types/portfolio';

const validateTicker = async (ticker: string): Promise<boolean> => {
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        const data = await response.json() as StockApiSuccessResponse | StockApiErrorResponse;
        return data.valid;
    } catch (error){
        return false;
    }
}

const getLivePrice = async (ticker: string): Promise<number|null> => {
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        const data = await response.json() as StockApiSuccessResponse | StockApiErrorResponse;
        
        // if data is present 
        if(data){
            // if ticker was valid and we can get price
            if(data.valid && data.info.regularMarketPrice){
                return data.info.regularMarketPrice;
            }
        }
        // else log errors
        console.error(`Error fetching live price for ${ticker}: ${response.status} ${response.statusText}`);
        return null;
    } catch (error){
        console.error(`Error fetching live price for ${ticker}: ${error}`);
        return null;
    }
}

const getPortfolioAnalysis = async (stocks: Stock[]): Promise<string> => {
    try {
        const response = await fetch('/api/analyse/protfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ portfolioData: stocks } as PortfolioAnalysisRequest),
        });
        
        const data = await response.json() as PortfolioAnalysisResponse;
        
        if (!response.ok) {
            throw new Error((data as any).error || 'Failed to analyze portfolio');
        }
        
        return data.analysis || 'No analysis available';
    } catch (error) {
        console.error(`Error analyzing portfolio: ${error}`);
        throw error;
    }
}

export {validateTicker, getLivePrice, getPortfolioAnalysis}