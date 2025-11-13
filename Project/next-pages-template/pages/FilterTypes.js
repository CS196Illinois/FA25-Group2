export interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedTags: string[];
}

export const initialFilterState = {
  minPrice: 0,
  maxPrice: 100,
  selectedTags: [],
};

export const availableTags = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Services",
  "Other"
];
