import NavBar from "@/components/NavBar";
import ProtfolioInfo from "@/components/ProtfolioInfo";
import StockInput from "@/components/StockInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Protfy</h1>
          <p className="text-lg text-gray-600">
            Your intelligent portfolio management solution
          </p>
        </div>
        {/* added search bar to navBar */}
        {/* <div className="mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Stocks</h2>
            <SearchBar />
          </div>
        </div>
         */}
        <div className="mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Stock to Portfolio</h2>
            <StockInput />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Portfolio</h2>
            <ProtfolioInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
