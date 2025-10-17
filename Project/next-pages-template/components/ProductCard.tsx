import React from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    tags: string[];
    distance: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-start shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <img
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded-md"
        src={product.image}
      />
      <p className="text-[#FF5F05] font-semibold text-xl mb-1">
        {" "}
        {/* Illini Orange for price */}${product.price}
      </p>
      <h3 className="font-bold text-lg mb-1 text-[#13294B]">{product.name}</h3>{" "}
      {/* Illini Blue for name */}
      <p className="text-gray-700 text-sm mb-2 text-left">
        {product.description}
      </p>
      <p className="text-gray-600 text-sm mt-2 text-left">
        {product.distance} miles away
      </p>
    </div>
  );
}
