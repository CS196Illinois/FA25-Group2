import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import ProductCards from "@/components/productCards";
import axios from "axios";
import FilterSidebar from "@/components/FilterSidebar";

export default function Marketplace() {
    async function getProducts(filters = {}) {
        const params = {};

        if (filters.search) params.q = filters.search;
        if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
        if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
        if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

        const result = await axios.get("/api/products", { params });
        return result.data.products;
    }

    const [products, setProducts] = useState([]);

    const handleFilterUpdate = async (newFilters) => {
        const filteredProducts = await getProducts(newFilters);
        setProducts(filteredProducts);
    };

    useEffect(() => {
        async function x() {
            const products = await getProducts();
            setProducts(products);
        }

        x();
    }, []);

    return <>
        <Navbar />
        <div className="mt-8 container mx-auto px-4 flex gap-8">
            
            <aside className="hidden md:block">
                <FilterSidebar onUpdate={handleFilterUpdate} />
            </aside>

            
            <div className="flex-1">
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-5xl font-semibold mb-8">What deals will you discover?</h1>
                    
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <ProductCards products={products} buy />
                    </div>
                </div>
            </div>
        </div>
    </>
}