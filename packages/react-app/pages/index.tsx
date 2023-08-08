// This is the main page of the app

// Import the AddProductModal and ProductList components
import AddProductModal from "@/components/AddProductModal";
import ProductList from "@/components/ProductList";
import SearchProduct from "@/components/SearchProduct";
import { useState } from "react";

// Export the Home component
export default function Home() {
  const [search, setSearch] = useState<string>("all");

  const searchOptions = (options:any) => {
    const { option } = options;
    setSearch(option);
  }
  return (
    <div>
      <SearchProduct search={searchOptions} />
      <AddProductModal />
      <ProductList option={search} />
    </div>
  )
}