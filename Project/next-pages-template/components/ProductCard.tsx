import React from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300">
      <img
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded-md"
        src={product.image}
      />
      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <p className="text-primary-500 font-semibold text-xl">${product.price}</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
        View Details
      </button>
    </div>
  );
}
