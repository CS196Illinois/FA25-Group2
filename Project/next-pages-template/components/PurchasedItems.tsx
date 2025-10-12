import React from "react";

const items = [
  {
    id: 1,
    name: "Concert Tickets",
    price: "$100.00",
    image:
      "https://marketplace.canva.com/EAGGPvJkfLg/2/0/1600w/canva-beige-black-minimalist-event-music-festival-concert-ticket-QC3x-OO2_9M.jpg",
  },
  {
    id: 2,
    name: "Mini Fridge",
    price: "$75.00",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSRDeb-t3FzXuR3MRd3kuO1hwuM0ymySgpQw&s",
  },
];

export default function PurchasedItems() {
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
