import React, { useState } from "react";
import { Slider, Button, Input, Card, CardBody } from "@heroui/react";
import { Chip } from "@heroui/chip";

export default function FilterSidebar({ onUpdate }) {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set([]));
  const availableTags = ["Textbooks", "Electronics", "Furniture", "Clothing", "Other"];

  const toggleTag = (tag) => {
    const nextTags = new Set(selectedTags);
    if (nextTags.has(tag)) nextTags.delete(tag);
    else nextTags.add(tag);
    setSelectedTags(nextTags);
  };

  return (
    <Card className="w-64 h-fit p-4 shadow-sm border-small border-default-200">
      <CardBody className="flex flex-col gap-6">
        <div>
          <h3 className="text-medium font-bold mb-2">Search</h3>
          <Input 
            placeholder="Search items..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            size="sm"
            variant="bordered"
          />
        </div>
        <div>
          <h3 className="text-medium font-bold mb-2">Price Range</h3>
          <Slider 
            step={10} 
            minValue={0} 
            maxValue={2000} 
            defaultValue={[0, 1000]}
            value={priceRange} 
            onChange={setPriceRange}
            formatOptions={{style: "currency", currency: "USD"}}
            className="max-w-md"
            size="sm"
          />
          <div className="flex justify-between text-small text-default-500 mt-1">
            <span>${priceRange