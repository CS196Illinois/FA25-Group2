import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure, Button, Image, Card, CardBody, CardFooter, CardHeader, Link, Chip, Avatar, LinkIcon, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast, NumberInput } from "@heroui/react";
import { useState } from "react";
import axios from "axios";

export default function ProductCards({ products, buy }) {
    // buy: add buy now button? boolean
    
    return products.map((product) => {
        return <Card>
            <CardHeader>
                <Link href={`/products/${product.product_id}`}>
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
            <CardFooter className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                    {buy && <BuyButton product={product} />}

                    <p className="flex gap-2 items-center">Posted by 
                        <Link className="text-foreground gap-1" href={`/profile/${product.seller}`}><Avatar size="sm" src={product.pfp} showFallback /> {product.seller}</Link></p>
                </div>
                <div className="flex gap-2 mt-8">
                    {product.tags?.tags.map((tag) => {
                        return <Chip variant="flat" color="primary">{tag}</Chip>
                    })}
                </div>
            </CardFooter>
        </Card>
    });
}

export function BuyButton({ product }) {
    const [newPrice, setNewPrice] = useState(0);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    async function buy(username, authToken, price) {
        let result;
        try {
            result = await axios.post("/buy", {
                username,
                authToken,
                price
            });
        } catch (_) {
            return false;
        }

        return result.status == 200;
    }

    return <>

    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Negotiate with Seller</ModalHeader>
                    <ModalBody>
                        Price: <NumberInput startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">$</span>
                            </div>} onChange={(price) => {setNewPrice(price);}} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                        <Button color="primary" onPress={async () => {
                            const success = await buy(
                                window.localStorage.getItem("username"),
                                window.localStorage.getItem("authToken"),
                                newPrice
                            );
                            if (success) {
                                addToast({
                                    title: "Negotiation sent",
                                    description: "We've notified the seller about your bid."
                                });
                            } else {
                                addToast({
                                    title: "An error occurred",
                                    description: "Please try again.",
                                    color: "danger"
                                })
                            }
                        }}>Negotiate</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
    
    <Dropdown>
        <DropdownTrigger>
            <Button color="primary">Buy Now</Button>
        </DropdownTrigger> 
        <DropdownMenu onAction={async (key) => {
            if (key == "lp") {
                const success = await buy(
                    window.localStorage.getItem("username"),
                    window.localStorage.getItem("authToken"),
                    product.price
                );
                if (success) {
                    addToast({
                        title: "Item bought",
                        description: "We've notified the seller about your bid."
                    });
                } else {
                    addToast({
                        title: "An error occurred",
                        description: "Please try again.",
                        color: "danger"
                    })
                }
            }
        }}>
            <DropdownItem key="lp">Buy at listed price</DropdownItem>
            <DropdownItem key="n" onPress={onOpen}>Negotiate with seller</DropdownItem>
        </DropdownMenu>   
    </Dropdown>
    </>
}