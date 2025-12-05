import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chip, Avatar, Image, Link } from "@heroui/react";
import { BuyButton } from "../../components/productCards";
import { ToastProvider } from "@heroui/react";
import DefaultLayout from "../../layouts/default";

export default function ProductPage() {
    const router = useRouter();
    const { productID } = router.query;
    const [product, setProduct] = useState({});

    console.log(productID);

    async function fetchProduct(productID) {
        const response = await axios.get("/api/product", {
            params: {
                productID
            }
        });

        return response.data;
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function x() {
            setProduct(await fetchProduct(productID));
        }

        x();
    }, [router]);

    return <DefaultLayout>
        <ToastProvider placement="top-center"></ToastProvider>

        <h1 className="text-6xl font-bold mb-2">{product.name}</h1>
        
        <p className="flex gap-2 items-center mb-16 text-2xl">Posted by 
            <Link className="text-foreground text-2xl gap-2" href={`/profile/${product.seller}`}><Avatar size="md" src={product.pfp} showFallback /> {product.seller}</Link></p>

        <div className="flex gap-4">
            <Image width="600" height="600" className="mb-4" src={product.image}></Image>

            <div className="flex flex-col">
                <p className="text-xl mb-4">{product.description}</p>
                <Chip variant="flat" color="success" className="mb-4" radius="sm">
                    <p className="text-lg">${parseFloat(product.price).toFixed(2)}</p>
                </Chip>
                <BuyButton product={product} />
            </div>
        </div>

        
    </DefaultLayout>;
}