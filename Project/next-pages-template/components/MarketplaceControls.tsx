import React from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface MarketplaceControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

export default function MarketplaceControls({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
}: MarketplaceControlsProps) {
  const categories = [
    { label: "All", value: "all" },
    { label: "Apparel", value: "Apparel" },
    { label: "Books", value: "Books" },
    { label: "Electronics", value: "Electronics" },
    { label: "Home Goods", value: "Home Goods" },
    { label: "Musical Instruments", value: "Musical Instruments" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
      <Input
        fullWidth
        aria-label="Search products"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        aria-label="Filter by category"
        className="md:w-1/3"
        placeholder="Filter by category"
        selectedKeys={[categoryFilter]}
        onSelectionChange={(keys) =>
          onCategoryFilterChange(Array.from(keys)[0] as string)
        }
      >
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
