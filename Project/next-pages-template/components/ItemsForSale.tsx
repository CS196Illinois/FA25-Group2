import React from "react";

const items = [
  {
    id: 1,
    name: "Vintage T-Shirt",
    price: "$25.00",
    image:
      "https://media-assets.grailed.com/prd/listing/temp/bebc068d2b3249c2ba1fac7e308ac5db",
  },
  {
    id: 2,
    name: "Used Textbook",
    price: "$50.00",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/English_textbook.jpg",
  },
  {
    id: 3,
    name: "Desk Lamp",
    price: "$15.00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZg_P06voGgjZh8KJhju8wGGZ4fVkSixi_pA&s",
  },
];

export default function ItemsForSale() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4">
          <img
            alt={item.name}
            className="w-full h-48 object-cover mb-4"
            src={item.image}
          />
          <h3 className="font-bold">{item.name}</h3>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
}
