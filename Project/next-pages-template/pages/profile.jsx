import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tabs, Tab } from "@heroui/tabs";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import ProductCards from "@/components/productCards";
import axios from "axios";
import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const router = useRouter();

  async function getProfile(username) {
    const response = await axios.get("/api/profile", {
      params: {
        username
      }
    });
    
    return response.data;
  }

  useEffect(() => {
    async function x(username) {
      const profile = await getProfile(username);
      setProfile(profile);
    }
    const currentUsername = window.localStorage.getItem("username");
    if (!currentUsername) return;

    setUsername(currentUsername);
    x(currentUsername); 
  }, [router]);

  return (
    <DefaultLayout>
      <div className="flex justify-between">
        <section className="flex flex-col items-center gap-4 py-8 md:py-10 w-[65vw]">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Welcome back, {username}</h1>
          </div>
          <div className="w-full max-w-4xl">
            <Tabs aria-label="Profile Dashboard">
              <Tab key="for-sale" title="Items for Sale">
                <ProductCards products={profile?.forSale || []} />
              </Tab>
              <Tab key="purchased" title="Purchased Items">
                <ProductCards products={profile?.purchased || []} />
              </Tab>
            </Tabs>
          </div>
        </section>

        <section>
          <Card className="h-[80vh]">
            <CardHeader>
              <h1 className="text-xl font-semibold">How you'll appear</h1>
            </CardHeader>
            <CardBody className="items-center">
              <Avatar showFallback src={profile.pfp} size="lg" />
              <p className="text-lg font-semibold mt-2 mb-4">{profile.username}</p>
              <p>{profile.bio || "Add a bio"}</p>
              <p className="text-lg font-semibold mt-2 mb-4">Listed Products</p>
              <ProductCards products={profile?.forSale || []} />
            </CardBody>
          </Card>
        </section>
      </div>
    </DefaultLayout>
  );
}
