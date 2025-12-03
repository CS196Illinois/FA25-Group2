import { Navbar } from "@/components/navbar";
import { Avatar, Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useState } from "react";
import { title } from "@/components/primitives";

export default function Negotiation() {
    const [loading, setLoading] = useState([false, false, false]);
    // first button - accept, second button - decline, third button - block user

    return <>
        <Navbar />
        <div className="flex flex-col items-center m-16 ">
            <h1 className={title() + " mb-16"}>Negotiation Request</h1>
            <Card>
                <CardHeader className="flex justify-center">
                    <Link className="text-foreground" href={`/product/1`}><h1 className="text-2xl font-bold">Leather Jacket</h1></Link>
                </CardHeader>
                <CardBody>
                    <p className="flex items-center gap-1 p-2">
                    <Link className="text-foreground gap-1" href={`/profile/ari`}><Avatar size="sm" src="" showFallback /> ari</Link>
                    wants to buy this item for <span className="font-bold">$100</span>
                    </p>

                    <div className="flex gap-2 p-2">
                        <Button color="success" isLoading={loading[0]} onPress={() => {setLoading([true, false, false])}}>Accept</Button>
                        <Button color="danger" isLoading={loading[1]} onPress={() => {setLoading([false, true, false])}}>Decline</Button>
                        <Button color="danger" variant="flat" isLoading={loading[2]} onPress={() => {setLoading([false, false, true])}}>Block User</Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    </>
}