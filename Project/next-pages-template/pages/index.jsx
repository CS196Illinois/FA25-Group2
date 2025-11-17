import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return <div className="flex items-center m-64 ">
    <div>
      <h1 className="text-6xl font-bold mb-8">Jeaks Marketplace</h1>
      <p className="text-xl mb-8">A campus marketplace for UIUC students.</p>
      <Link href="/marketplace"><Button color="primary">Explore the Marketplace</Button></Link>
    </div>
    <Image></Image> 
    {/* add marketplace screenshot */}
  </div>
}