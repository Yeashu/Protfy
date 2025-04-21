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
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded"
        >
            {showInputs ? 'Cancel' : 'Add To Portfolio'}
        </button>
        {showInputs && (
            <div className="inline-flex items-center ml-2 space-x-2">
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Qty"
                    className="border rounded px-1 py-0.5 text-xs w-12"
                    onClick={(e) => e.stopPropagation()}
                />
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(e.target.value)}
                    placeholder="Avg Price"
                    className="border rounded px-1 py-0.5 text-xs w-16"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    onClick={handleAdd}
                    className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded"
                >
                    Add
                </button>
            </div>
        )}
    </div>
  )
}

export default AddToProtfolio