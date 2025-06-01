"use client"
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { useAllProducts } from "@/lib/hooks/useProducts";
import { useEffect, useState } from "react";
import Product from "@/lib/types/product";
import Slider from "@/components/Slider";

export default function Home() {
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const res = useAllProducts(1, 44);

  useEffect(() => {
    if (res.data?.data?.result) {
      setTopSelling(res.data.data.result);
    }
  }, [res.data]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar */}
      <NavBar />

      {/* Main */}
      <main className="p-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Top Selling Products</h2>
          <div className="w-full relative">
            <Slider items={topSelling} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Best Rated</h2>
          <div className="w-full relative">
            <Slider items={topSelling} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Live Auctions</h2>
          <div className="w-full relative">
            <Slider items={topSelling} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Upcoming Auction</h2>
          <div className="w-full relative">
            <Slider items={topSelling} />
          </div>
        </div>
      </main>
    </div>
  );
}
