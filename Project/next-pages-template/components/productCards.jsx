import { Button, Image, Card, CardBody, CardFooter, CardHeader, } from "@heroui/react";

export default function ProductCards({ products, buy }) {
    // buy: add buy now button? boolean
    
    return products.map((product) => {
        return <Card>
            <CardHeader>
                <Image src={product.image} width="200px" height="200px" isZoomed />
            </CardHeader>
            <CardBody>
                <p className="text-xl font-semibold">${product.price}</p>
                <p className="text-xl">{product.name}</p>
                <p>{product.description}</p>
            </CardBody>
            <CardFooter>
                <div className="flex items-center gap-2">
                    {buy && <Button color="primary">Buy Now</Button>}
                    <p>Posted by {product.user_id}</p>
                </div>
            </CardFooter>
        </Card>
    });
}