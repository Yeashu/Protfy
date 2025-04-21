import React, { useContext, useState } from 'react'
import { PortfolioContext } from '@/context/ProtfolioContext'
import { Stock } from '@/types/stock';

function AddToProtfolio({ticker}:{ticker: string}) {
    const {addStock} = useContext(PortfolioContext);
    const [showInputs, setShowInputs] = useState(false);
    const [quantity, setQuantity] = useState<string | number>('');
    const [avgPrice, setAvgPrice] = useState<string | number>('');

    const handleToggleInputs = ()=>{
        setShowInputs(!showInputs);
        if (showInputs) {
            setQuantity('');
            setAvgPrice('');
        }
    }

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const numQuantity = Number(quantity);
        const numAvgPrice = Number(avgPrice);

        if (Number.isFinite(numQuantity) && numQuantity > 0 && Number.isFinite(numAvgPrice) && numAvgPrice >= 0) {
            const stockToAdd: Stock = { ticker: ticker.toUpperCase(), quantity: numQuantity, avgPrice: numAvgPrice };
            addStock(stockToAdd);
            setShowInputs(false);
            setQuantity('');
            setAvgPrice('');
        } else {
            alert("Please enter a valid quantity (must be > 0) and average price (must be >= 0).");
        }
    }

  return (
    <div className="inline-block ml-2">
        <button
            onClick={handleToggleInputs}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md shadow transition-colors duration-150"
        >
            {showInputs ? 'Cancel' : 'Add To Portfolio'}
        </button>
        {showInputs && (
            <div className="absolute mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="flex flex-col space-y-2">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Qty"
                            className="border rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div>
                        <label htmlFor="avg-price" className="block text-sm font-medium text-gray-700 mb-1">Average Price</label>
                        <input
                            id="avg-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={avgPrice}
                            onChange={(e) => setAvgPrice(e.target.value)}
                            placeholder="Avg Price"
                            className="border rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 px-3 rounded-md shadow transition-colors duration-150 mt-1"
                    >
                        Add
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default AddToProtfolio