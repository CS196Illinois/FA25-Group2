import React, { useState, useMemo } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select"; // Import Select and SelectItem
import { Slider } from "@heroui/slider";

interface MarketplaceControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  tagSearchTerm: string;
  onTagSearchChange: (tag: string) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  distanceFilter: number;
  onDistanceFilterChange: (distance: number) => void;
  minPriceFilter: number;
  maxPriceFilter: number;
  onPriceFilterChange: (priceRange: [number, number]) => void;
  sortBy: string; // New prop
  onSortByChange: (sortBy: string) => void; // New prop
}

export default function MarketplaceControls({
  searchTerm,
  onSearchChange,
  tagSearchTerm,
  onTagSearchChange,
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  distanceFilter,
  onDistanceFilterChange,
  minPriceFilter,
  maxPriceFilter,
  onPriceFilterChange,
  sortBy, // New prop
  onSortByChange, // New prop
}: MarketplaceControlsProps) {
  const [currentTagInput, setCurrentTagInput] = useState("");

  const suggestions = useMemo(() => {
    if (!currentTagInput) return [];
    const lowerCaseInput = currentTagInput.toLowerCase();

    return availableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(lowerCaseInput) &&
          !selectedTags.includes(tag),
      )
      .slice(0, 5);
  }, [currentTagInput, availableTags, selectedTags]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTagInput(e.target.value);
  };

  const handleSuggestionClick = (tag: string) => {
    onTagSelect(tag);
    setCurrentTagInput("");
  };

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <Input
        fullWidth
        aria-label="Search products"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="relative">
        <Input
          fullWidth
          aria-label="Search tags"
          placeholder="Search tags..."
          value={currentTagInput}
          onChange={handleTagInputChange}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              currentTagInput &&
              !selectedTags.includes(currentTagInput)
            ) {
              onTagSelect(currentTagInput);
              setCurrentTagInput("");
            }
          }}
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
            {suggestions.map((tag) => (
              <div
                key={tag}
                className="p-2 cursor-pointer hover:bg-gray-100"
                role="button"
                tabIndex={0}
                onClick={() => handleSuggestionClick(tag)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSuggestionClick(tag);
                  }
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-[#13294B] text-white text-sm font-medium px-2.5 py-0.5 rounded-full"
            >
              {tag}
              <button
                className="ml-1 inline-flex items-center p-0.5 text-[#FF5F05] hover:text-orange-700"
                type="button"
                onClick={() => onTagRemove(tag)}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <Slider
        className="mt-4"
        classNames={{
          label: "text-[#13294B] font-bold dark:text-white",
        }}
        defaultValue={distanceFilter}
        label="Distance (miles)"
        maxValue={10}
        minValue={0}
        step={1}
        onChangeEnd={(value) => onDistanceFilterChange(value as number)}
      />
      <Slider
        className="mt-4"
        classNames={{
          label: "text-[#13294B] font-bold dark:text-white",
        }}
        defaultValue={[minPriceFilter, maxPriceFilter]}
        formatOptions={{ style: "currency", currency: "USD" }}
        label="Price Range"
        maxValue={1000}
        minValue={0}
        step={10}
        onChangeEnd={(value) => onPriceFilterChange(value as [number, number])}
      />

      {/* New Sort By Select component */}
      <Select
        aria-label="Sort by"
        className="mt-4"
        placeholder="Sort by"
        selectedKeys={[sortBy]}
        onSelectionChange={(keys) =>
          onSortByChange(Array.from(keys)[0] as string)
        }
      >
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
