import { Navbar } from "@/components/navbar";
import { useState, useEffect } from "react";
import ProductCards from "@/components/productCards";
import axios from "axios";
import { ToastProvider, Card, CardBody, Input, Button } from "@heroui/react";

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    async function getProducts() {
        try {
            const params = {};
            if (search) params.search = search;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;

            const result = await axios.get("/api/products", { params });
            setProducts(result.data.products);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <Navbar />
            <ToastProvider placement="top-center" toastOffset={60} />
            
            <div className="flex flex-col md:flex-row p-6 gap-6 max-w-7xl ml-8 min-h-screen">
                <div className="w-full md:w-1/4 min-w-[250px]">
                    <Card className="sticky top-40 mr-8">
                        <CardBody className="gap-6 p-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            
                            <div>
                                <p className="text-sm font-semibold mb-2 text-default-500">Search</p>
                                <Input 
                                    placeholder="Product name..." 
                                    value={search} 
                                    onValueChange={setSearch}
                                    isClearable
                                    onClear={() => setSearch("")}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-2 text-default-500">Price Range</p>
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        type="number" 
                                        placeholder="Min" 
                                        startContent={<span className="text-default-400 text-small">$</span>}
                                        value={minPrice} 
                                        onValueChange={setMinPrice}
                                    />
                                    <span className="text-default-400">-</span>
                                    <Input 
                                        type="number" 
                                        placeholder="Max" 
                                        startContent={<span className="text-default-400 text-small">$</span>}
                                        value={maxPrice} 
                                        onValueChange={setMaxPrice}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                <Button color="primary" onPress={getProducts}>
                                    Apply Filters
                                </Button>
                                <Button variant="light" color="danger" onPress={() => {
                                    setSearch("");
                                    setMinPrice("");
                                    setMaxPrice("");
                                    window.location.reload(); 
                                }}>
                                    Reset
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="w-full md:w-3/4">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-semibold mb-8 self-start">What deals will you discover?</h1>
                        
                        {products.length === 0 ? (
                            <div className="mt-12 text-default-500 text-lg">
                                No products found matching your filters.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                <ProductCards products={products} buy />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}