import NavBar from "@/components/NavBar";
import ProtfolioInfo from "@/components/ProtfolioInfo";
import SearchBar from "@/components/SearchBar";
import StockInput from "@/components/StockInput";

export default function Home() {
  return (
    <>
    <NavBar/>
    <SearchBar/>
    <StockInput/>
    <ProtfolioInfo/>
    </>
  );
}
