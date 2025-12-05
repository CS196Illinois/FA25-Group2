import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure, Button, Image, Card, CardBody, CardFooter, CardHeader, Link, Chip, Avatar, LinkIcon, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast, NumberInput } from "@heroui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export function DeleteIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
}

export function ConfirmIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
}

export default function ProductCards({ products, buy, profile }) {
    // buy: add buy now button? boolean
    const router = useRouter();
    const [user, setUser] = useState("");
    const [confirmation, setConfirmation] = useState({});

    async function getProfile(username, authToken) {
        const response = await axios.get("/api/profile", {
            params: {
                username,
                authToken
            }
        });

        return response.data;
    }

    async function deleteListing(username, authToken, product_id) {
        await axios.post("/api/delete-listing", {
            username,
            authToken,
            product_id
        })
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function x() {
            const profile = await getProfile(
                window.localStorage.getItem("username"),
                window.localStorage.getItem("authToken"),
            );
            setUser(profile.username);
        }

        x();
    }, [router]);
    
    return products.map((product, i) => {
        return <Card className="">
            <CardHeader>
                <Link href={`/products/${product.product_id}`}>
                    <Image src={product.image} width={200} height={200} isZoomed />
                </Link>
            </CardHeader>
            <CardBody>
                <Link className="text-foreground text-xl font-semibold mb-2" href={`/products/${product.product_id}`}>{product.name}</Link>
                <p>{product.description}</p>
                <Chip variant="flat" color="success" className="mt-4" radius="sm">
                    <p className="text-lg">${parseFloat(product.price).toFixed(2)}</p>
                </Chip>
            </CardBody>
            <CardFooter className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                    {buy && <BuyButton product={product} profile={profile} user={user} />}

                    <p className="flex gap-2 items-center">Posted by 
                        <Link className="text-foreground gap-1" href={`/profile/${profile?.username || product.seller}`}><Avatar size="sm" src={profile?.pfp || product.pfp} showFallback /> {profile?.username || product.seller}</Link></p>
                </div>
                <div className="flex gap-2 mt-8">
                    {product.tags?.tags.map((tag) => {
                        return <Chip variant="flat" color="primary">{tag}</Chip>
                    })}
                </div>
                <div className="flex gap-2 mt-2 h-10">
                    {(user == (profile?.username || product.seller)) && <Button isIconOnly variant="flat" color="danger" onPress={() => {setConfirmation({...confirmation, [i]: !confirmation[i]})}}><DeleteIcon /></Button>}
                    {confirmation[i] && <Button isIconOnly variant="flat" color="success" onPress={async () => {
                        setConfirmation(false);
                        await deleteListing(
                            window.localStorage.getItem("username"),
                            window.localStorage.getItem("authToken"),
                            product.product_id
                        );
                        router.reload();
                    }}><ConfirmIcon /></Button>}
                </div>
            </CardFooter>
        </Card>
    });
}

export function BuyButton({ product, profile, user }) {
    const [newPrice, setNewPrice] = useState(0);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    async function buy(username, authToken, price, product_id) {
        let result;
        try {
            result = await axios.post("/api/buy", {
                username,
                authToken,
                price,
                product_id
            });

            const negotiation_id = result.data.negotiation_id;

            await axios.post("/api/notifyNegotiation", {
                sender: username,
                authToken,
                price,
                product_id,
                negotiation_id
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return error.response.data.error;
            }

            return false;
        }

        if (result.status == 200) {
            return true;
        }


        return result.data.error;
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
                                newPrice,
                                product.product_id
                            );
                            if (success) {
                                addToast({
                                    title: "Negotiation sent",
                                    description: "We've notified the seller about your bid.",
                                    color: "primary"
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
            <Button className="w-20" color="primary" isDisabled={(user == (profile?.username || product.seller))}>Buy</Button>
        </DropdownTrigger> 
        <DropdownMenu onAction={async (key) => {
            if (key == "lp") {
                const success = await buy(
                    window.localStorage.getItem("username"),
                    window.localStorage.getItem("authToken"),
                    product.price,
                    product.product_id
                );
                if (success) {
                    addToast({
                        title: "Item bought",
                        description: "We've notified the seller that you want to buy this item.",
                        color: "primary"
                    });
                } else {
                    addToast({
                        title: "An error occurred",
                        description: "Please try again.",
                        color: "danger"
                    });
                }
            }
        }}>
            <DropdownItem key="lp">Buy at listed price</DropdownItem>
            <DropdownItem key="n" onPress={onOpen}>Negotiate with seller</DropdownItem>
        </DropdownMenu>   
    </Dropdown>
    </>
}