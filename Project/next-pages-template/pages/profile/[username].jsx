import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import ProductCards from "@/components/productCards";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Input, Avatar, Card, CardBody, CardHeader, CardFooter, Button, Textarea, Link, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";

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
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    async function getProfile(username, authToken) {
        const response = await axios.get("/api/profile", {
            params: {
                username,
                authToken
            }
        });

        return response.data;
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
            const profile = await getProfile(username, window.localStorage.getItem("authToken"));
            setProfile(profile);
            setBio(profile.bio);
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
            <PfpModal isOpen={isOpen} onOpenChange={onOpenChange} profile={profile} setProfile={setProfile} />
            <Card className="h-[80vh] p-4">
                <CardHeader>
                    <h1 className="text-2xl font-semibold">How you'll appear</h1>
                </CardHeader>
                <CardBody className="items-center">
                    <div>
                        {
                        profile.me ? <Link onPress={onOpen}>
                                <Avatar showFallback src={profile.pfp} className="w-20 h-20" />
                            </Link> : <Avatar showFallback src={profile.pfp} className="w-20 h-20" />
                        }  
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

export function PfpModal({ isOpen, onOpenChange, profile, setProfile }) {
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);

    async function updatePfp(user_id, authToken, pfp) {

        let resizedPfpB64;

        if (pfp != "") {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true
            }
            const resizedPfp = await imageCompression(pfp, options)
            const reader = new FileReader()
            resizedPfpB64 = await new Promise(r=>{reader.onload=()=>r(reader.result.split(",")[1]);reader.readAsDataURL(resizedPfp)})
        }

        const response = await axios.post("/api/updatePfp", {
            user_id,
            authToken,
            pfp: resizedPfpB64 || ""
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        return response.data;
    }

    return <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader>
                        <h1 className="text-2xl font-bold">Edit profile picture</h1>
                    </ModalHeader>
                    <ModalBody>
                        <Input type="file" onChange={(e) => {
                            setFile(e.target.files[0]);
                        }} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" isLoading={loading} onPress={async () => {
                            setLoading(true);
                            const result = await updatePfp(profile.user_id, window.localStorage.getItem("authToken"), file);
                            setProfile({...profile, pfp: result.pfp});
                            setLoading(false);
                            onClose();
                        }}>Change</Button>
                        <Button onPress={onClose} color="danger" variant="faded">Cancel</Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}


