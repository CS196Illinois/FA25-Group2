import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure, Button, Image, Card, CardBody, CardFooter, CardHeader, Link, Chip, Avatar, LinkIcon, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast, NumberInput } from "@heroui/react";
import { useState } from "react";
import axios from "axios";

export default function ProductCards({ products, buy }) {
    // buy: add buy now button? boolean
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [newPrice, setNewPrice] = useState(0);

    async function sendNegotiation(username, authToken, price) {
        let result;
        try {
            result = await axios.post("/negotiate", {
                username,
                authToken,
                price
            });
        } catch (_) {
            return false;
        }

        if (result.status == 200) {
            return true;
        }

        return false;
    }
    
    return products.map((product) => {
        return <Card>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Negotiate with Seller</ModalHeader>
                            <ModalBody>
                                Price: <NumberInput startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">$</span>
                                    </div>} onChange={(price) => {setNewPrice(price);console.log(price);}} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Cancel</Button>
                                <Button color="primary" onPress={async () => {
                                    const success = await sendNegotiation(
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
                    {buy && 
                    <Dropdown>
                        <DropdownTrigger>
                            <Button color="primary">Buy Now</Button>
                        </DropdownTrigger> 
                        <DropdownMenu onAction={(key) => {
                            if (key == "lp") {
                                addToast({
                                    title: "Order placed",
                                    description: "We've notified the seller that you've placed this order."
                                });
                            }
                        }}>
                            <DropdownItem key="lp">Buy at listed price</DropdownItem>
                            <DropdownItem key="n" onPress={onOpen}>Negotiate with seller</DropdownItem>
                        </DropdownMenu>   
                    </Dropdown>}
                    <p className="flex gap-2 items-center">Posted by 
                        <Link className="text-foreground gap-1" href={`/profile/${product.seller}`}><Avatar size="sm" src={product.pfp} showFallback /> {product.seller}</Link></p>
                </div>
            </CardFooter>
        </Card>
    });
}