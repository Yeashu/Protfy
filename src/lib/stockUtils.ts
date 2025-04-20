const validateTicker = async (ticker: string):Promise<boolean> => {
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        const data = await response.json();
        return data.valid;
    } catch (error){
        return false;
    }
}

const getLivePrice = async (ticker: string):Promise<number|null> =>{
    try {
        const response = await fetch(`/api/stock/${ticker}`);
        const data = await response.json();
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

export {validateTicker, getLivePrice}