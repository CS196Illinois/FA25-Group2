import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Image, Link } from "@heroui/react";
import { BuyButton } from "../../components/productCards";
import { ToastProvider } from "@heroui/react";

export default function ProductPage() {
    const router = useRouter();
    const { productID } = router.query;
    const [product, setProduct] = useState({});

    console.log(productID);

    async function fetchProduct(productID) {
        const response = await axios.get("/product", {
            params: {
                productID
            }
        });

        return response.data;
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function x() {
            // setProduct(await fetchProduct(productID));
        }

        x();
    }, [router]);

    return <div className="m-20">
        <ToastProvider placement="top-center"></ToastProvider>

        <h1 className="text-6xl font-bold mb-2">Product Name</h1>
        
        <p className="flex gap-2 items-center mb-16 text-2xl">Posted by 
            <Link className="text-foreground text-2xl gap-2" href={`/profile/${product.seller}`}><Avatar size="md" src={product.pfp} showFallback /> ari{product.seller}</Link></p>

        <div className="flex gap-4">
            <Image width="1000" height="1000" className="mb-4" src="https://i.redd.it/o44ltaqwatmd1.jpeg"></Image>

            <div>
                <p className="text-xl mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente voluptatem, consequuntur expedita doloribus tempora ex facilis deleniti ab vitae reprehenderit libero atque earum, temporibus delectus recusandae! Vel cum sapiente praesentium?</p>
                <BuyButton product={product} />
            </div>
        </div>

        
    </div>;
}