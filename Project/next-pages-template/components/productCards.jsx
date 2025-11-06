import { Button, Image, Card, CardBody, CardFooter, CardHeader, Link, Chip, } from "@heroui/react";

export default function ProductCards({ products, buy }) {
    // buy: add buy now button? boolean
    
    return products.map((product) => {
        return <Card>
            <CardHeader>
                <Link href={`/marketplace`}>
                    <Image src={product.image} width="200px" height="200px" isZoomed />
                </Link>
            </CardHeader>
            <CardBody>
                <p className="text-xl font-semibold mb-2">{product.name}</p>
                <p>{product.description}</p>
                <Chip variant="flat" color="success" className="mt-4" radius="sm">
                    <p className="text-lg">${parseFloat(product.price).toFixed(2)}</p>
                </Chip>
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