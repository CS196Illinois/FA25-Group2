import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import DefaultLayout from "@/layouts/default";

export default function HomePage() {
  return <DefaultLayout>
    <div className="flex items-center mt-36">
      <div className="mr-16">
        <h1 className="text-6xl font-bold mb-8">Jeaks Marketplace</h1>
        <p className="text-xl mb-8">A campus marketplace for UIUC students.</p>
        <Link href="/marketplace"><Button color="primary">Explore the Marketplace</Button></Link>
      </div>
      <Image width={800} height={600} src="https://i.imgur.com/nph6rem.png"></Image> 
    </div>
  </DefaultLayout>
}