const validateTicker = async (tickerSymbol: string) => {
    try {
        const response = await fetch(`/api/stock/${tickerSymbol}`);
        const data = await response.json();
        return data.valid;
    } catch (error){
        return false;
    }
}


export {validateTicker};