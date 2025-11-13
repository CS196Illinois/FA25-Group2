import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import ProductCards from "@/components/productCards";
import axios from "axios";
import { ToastProvider } from "@heroui/react";

export default function Marketplace() {
    async function getProducts() {
        const result = await axios.get("/api/products", {
            params: {
                filters: []
            } 
        });

        return result.data.products;
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function x() {
            const products = await getProducts();
            setProducts(products);
        }

        x();
    }, []);

    return <>
        <Navbar />
        <ToastProvider placement="top-center" toastOffset={60}></ToastProvider>
        <div className="mt-4">
            <div></div>
            <div>
                <div className="flex flex-col items-center">
                    <h1 className="text-5xl font-semibold mb-8">What deals will you discover?</h1>
                    <div className="grid grid-cols-3 gap-4">
                        <ProductCards products={products} buy />
                    </div>
                </div>
            </div>
        </div>
    </>
}