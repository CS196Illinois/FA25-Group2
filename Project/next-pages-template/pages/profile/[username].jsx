import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import ProductCards from "@/components/productCards";
import axios from "axios";
import { Avatar, Card, CardBody, CardHeader, CardFooter, Button, Textarea } from "@heroui/react";

export function PencilIcon({ color }) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color} className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>;
}

export default function ProfilePage() {
    const router = useRouter();
    const { username } = router.query;
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState("");
    const [notifications, setNotifications] = useState([]);

    async function getProfile(username, authToken) {
        const response = await axios.get("/api/profile", {
            params: {
                username,
                authToken
            }
        });

        return response.data;
    }

    async function getNotifications(username, authToken) {
    try {
        const res = await axios.get("/api/notifications", { params: { username, authToken } });
        setNotifications(res.data.notifications || []);
    } catch (e) {
        console.error(e);
    }
}

    async function updateBio(user_id, authToken, bio) {
        await axios.post("/api/updateBio", {
            user_id,
            authToken,
            bio
        });
    }

    useEffect(() => {
        if (!router.isReady) return;

        async function x(username) {
            const authToken = window.localStorage.getItem("authToken");
            const profile = await getProfile(username, authToken);
            setProfile(profile);
            setBio(profile.bio);

            if (profile.me) {
                getNotifications(username, authToken);
            }
        }

        x(username);
    }, [router]);

    return (
    <DefaultLayout>
        <div className="flex justify-between">
        <section className="flex flex-col items-center gap-4 py-8 md:py-10 w-[65vw]">
            <div className="inline-block max-w-lg text-center justify-center">
                <h1 className={title()}>Welcome back, {username}</h1>
            </div>
            <div className="w-full max-w-4xl">
                <p className="text-3xl font-semibold mb-4 mt-8">Your Recent Purchases</p>
                <div className="grid grid-cols-3 gap-4">
                    <ProductCards products={profile?.purchases || []} />
                </div>
            </div>
        </section>

        <section>
            <Card className="h-[80vh] p-4">
                <CardHeader>
                    <h1 className="text-2xl font-semibold">How you'll appear</h1>
                </CardHeader>
                <CardBody className="items-center">
                    <div>
                        <Avatar showFallback src={profile.pfp} className="w-20 h-20" />
                    </div>

                    <p className="text-xl font-semibold mt-2 mb-4">@{profile.username}</p>
                    <div className={editing ? "hidden" : ""}>
                        <div className="flex gap-2 items-center">
                            <p>{bio || (profile.me ? "Add a bio" : "")}</p>
                            <div onClick={() => {setEditing(true)}}>
                                <PencilIcon color="grey"/>
                            </div>
                        </div>
                    </div>
                    <div className={editing ? "" : "hidden"}>
                        <Card>
                            <CardBody>
                                <Textarea onChange={(e) => {
                                    setBio(e.target.value);
                                }}></Textarea>
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" onPress={async () => {
                                    setProfile({...profile, bio });
                                    setEditing(false);
                                    await updateBio(profile.user_id, window.localStorage.getItem("authToken"), bio);
                                }}>Save</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {profile.me && notifications && notifications.length > 0 && (
                        <div className="w-full mb-6 border-b-1 pb-4 border-default-200">
                            <p className="text-xl font-bold text-danger mb-3">🔔 Pending Requests</p>
                            <div className="flex flex-col gap-2">
                                {notifications.map((n) => (
                                    <Card key={n.negotiation_id} className="bg-default-100 shadow-sm">
                                        <CardBody className="py-2 px-3 flex flex-row justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">
                                                    @{n.buyer} offers <span className="text-success font-bold">${n.offer_price}</span>
                                                </span>
                                                <span className="text-xs text-default-500 truncate max-w-[150px]">
                                                    for {n.product_name}
                                                </span>
                                            </div>
                                            <Button 
                                                size="sm" 
                                                color="primary" 
                                                variant="solid"
                                                className="min-w-[60px] h-8"
                                                onPress={() => router.push(`/negotiation/${n.negotiation_id}`)}
                                            >
                                                View
                                            </Button>
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <p className="text-2xl font-bold my-4">Listed Products</p>

                    <div className="grid grid-cols-1 gap-4">
                        <ProductCards products={profile?.forSale || []} />
                    </div>
                </CardBody>
            </Card>
        </section>
        </div>
    </DefaultLayout>
    );
}
