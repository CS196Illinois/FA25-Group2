import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Tabs, Tab } from "@heroui/tabs";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import ItemsForSale from "@/components/ItemsForSale";
import PurchasedItems from "@/components/PurchasedItems";
import { useAppContext } from "@/context/AppContext";

export default function ProfilePage() {
  const [user, setUser] = useState({ email: "testuser@example.com" });
  const router = useRouter();
  const { setShowSignOutInNavbar } = useAppContext();

  useEffect(() => {
    setShowSignOutInNavbar(true);

    return () => setShowSignOutInNavbar(false);
  }, [setShowSignOutInNavbar]);

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Welcome back, Illini</h1>
        </div>
        <div className="w-full max-w-4xl">
          <Tabs aria-label="Profile Dashboard">
            <Tab key="for-sale" title="Items for Sale">
              <ItemsForSale />
            </Tab>
            <Tab key="purchased" title="Purchased Items">
              <PurchasedItems />
            </Tab>
          </Tabs>
        </div>
      </section>
    </DefaultLayout>
  );
}
