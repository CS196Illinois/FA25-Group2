import React, { useState, useMemo } from "react";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import MarketplaceControls from "@/components/MarketplaceControls";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [searchTerm, categoryFilter]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center mb-8">
          <h1 className={title()}>What deals will you discover?</h1>
        </div>

        <MarketplaceControls
          categoryFilter={categoryFilter}
          searchTerm={searchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
