import React, { useState, useMemo } from "react";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import MarketplaceControls from "@/components/MarketplaceControls";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [minPriceFilter, setMinPriceFilter] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");

  const availableTags = useMemo(() => {
    const allTags = products.flatMap((product) => product.tags);

    return Array.from(new Set(allTags));
  }, []);

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.every((selectedTag) =>
          product.tags.some((productTag) =>
            productTag.toLowerCase().includes(selectedTag.toLowerCase()),
          ),
        ),
      );
    }

    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price);

      return price >= minPriceFilter && price <= maxPriceFilter;
    });

    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return parseInt(b.id) - parseInt(a.id);
      } else if (sortBy === "price-asc") {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortBy === "price-desc") {
        return parseFloat(b.price) - parseFloat(a.price);
      }

      return 0;
    });

    return filtered;
  }, [
    searchTerm,
    selectedTags,
    distanceFilter,
    minPriceFilter,
    maxPriceFilter,
    sortBy,
  ]);

  return (
    <DefaultLayout>
      <section className="flex flex-col md:flex-row h-full">
        <aside className="md:w-1/4 p-4 bg-[#13294B]/5 h-full border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-[#FF5F05]">Filters</h2>
          <MarketplaceControls
            availableTags={availableTags}
            distanceFilter={distanceFilter}
            maxPriceFilter={maxPriceFilter}
            minPriceFilter={minPriceFilter}
            searchTerm={searchTerm}
            selectedTags={selectedTags}
            sortBy={sortBy}
            onDistanceFilterChange={setDistanceFilter}
            onPriceFilterChange={([min, max]) => {
              setMinPriceFilter(min);
              setMaxPriceFilter(max);
            }}
            onSearchChange={setSearchTerm}
            onSortByChange={setSortBy}
            onTagRemove={handleTagRemove}
            onTagSelect={handleTagSelect}
          />
        </aside>

        <div className="md:w-3/4 p-4 flex flex-col items-center bg-[#13294B]/2 mt-8">
          <div className="inline-block max-w-lg text-center justify-center mb-8">
            <h1 className={title({ class: "text-[#13294B] dark:text-white" })}>
              What deals will you discover?
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
