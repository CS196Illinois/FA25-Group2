import { Navbar } from "@/components/navbar";
import { Textarea, Avatar, Button, Card, CardBody, CardHeader, Link, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { useRouter } from "next/router";
import axios from "axios";

export default function Negotiation() {
    const [loading, setLoading] = useState([false, false, false]);
    const [negotiationLoading, setNegotiationLoading] = useState(true);
    const [negotiation, setNegotiation] = useState({});
    const [message, setMessage] = useState("");
    const router = useRouter();
    // first button - accept, second button - decline, third button - block user

    async function getNegotiation(username, authToken, negotiation_id) {
        const response = await axios.get("/api/negotiation", {
            params: {username, authToken, negotiation_id}
        });

        return response.data.negotiation;
    }

    async function senderNotification(username, authToken, negotiationID, choice, userMessage) {
        await axios.post("/api/sender-notification", {
            seller_username: username,
            authToken,
            negotiation_id: negotiationID,
            choice,
            userMessage
        });
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function x() {
            const response = await getNegotiation(
                window.localStorage.getItem("username"),
                window.localStorage.getItem("authToken"),
                parseInt(router.query.negotiationID)
            );
            setNegotiation(response);
            setNegotiationLoading(false);
        }

        x();
    }, [router]);

    return <>
        <Navbar />
        <div className="flex flex-col items-center m-16 ">
            <h1 className={title() + " mb-16"}>Negotiation Request</h1>
            {negotiationLoading ? <Spinner size="lg" /> : <Card>
                <CardHeader className="flex justify-center">
                    <Link className="text-foreground" href={`/product/${negotiation?.product_id}`}><h1 className="text-2xl font-bold">{negotiation?.name}</h1></Link>
                </CardHeader>
                <CardBody>
                    <p className="flex items-center gap-1 p-2">
                    <Link className="text-foreground gap-1" href={`/profile/${negotiation?.username}`}><Avatar size="sm" src={negotiation?.pfp} showFallback /> {negotiation?.username}</Link>
                    wants to buy this item for <span className="font-bold">${parseFloat(negotiation?.price).toFixed(2)}</span>
                    </p>

                    <Textarea className="mb-4" placeholder="Leave a message for the buyer..." onChange={(e) => {
                        setMessage(e.target.value);
                    }}>{message}</Textarea>

                    <div className="flex gap-2 p-2">
                        <Button color="success" isLoading={loading[0]} onPress={async () =>  {
                            setLoading([true, false, false]);
                            await senderNotification(
                                window.localStorage.getItem("username"),
                                window.localStorage.getItem("authToken"),
                                parseInt(router.query.negotiationID),
                                "accepted",
                                message
                            );
                            setLoading([false, false, false]);
                            router.push("/marketplace");
                        }}>Accept</Button>
                        <Button color="danger" isLoading={loading[1]} onPress={async () =>  {
                            setLoading([false, true, false]);
                            await senderNotification(
                                window.localStorage.getItem("username"),
                                window.localStorage.getItem("authToken"),
                                parseInt(router.query.negotiationID),
                                "rejected",
                                message
                            );
                            setLoading([false, false, false]);
                            router.push("/marketplace");
                        }}>Decline</Button>
                        <Button color="danger" variant="flat" isLoading={loading[2]} onPress={async () =>  {
                            setLoading([false, false, true]);
                            await senderNotification(
                                window.localStorage.getItem("username"),
                                window.localStorage.getItem("authToken"),
                                parseInt(router.query.negotiationID),
                                "blocked",
                                message
                            );
                            setLoading([false, false, false]);
                            router.push("/marketplace");
                        }}>Block User</Button>
                    </div>
                </CardBody>
            </Card>}
        </div>
    </>
}