// This is a stub file to provide data structure reference for the backend

// Define the filter data structure (Interface for what we send to backend)
export interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedTags: string[]; // e.g. ['Electronics', 'Books']
}

// Define mock data - use this for testing your UI right now
export const initialFilterState: FilterState = {
  minPrice: 0,
  maxPrice: 100, // Placeholder for maximum price
  selectedTags: [], // Initially no tags selected
};

// Pre-defined tags for selection chips
export const availableTags = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Services"
];