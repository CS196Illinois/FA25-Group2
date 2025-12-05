import React, { useState, useEffect } from 'react';
import { initialFilterState, availableTags, FilterState } from '../FilterStub';

export const FilterPanel = () => {

  const [minPrice, setMinPrice] = useState(initialFilterState.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilterState.maxPrice);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilterState.selectedTags);


  useEffect(() => {
    const savedFilters = localStorage.getItem('userFilters');
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      setMinPrice(parsed.minPrice);
      setMaxPrice(parsed.maxPrice);
      setSelectedTags(parsed.selectedTags);
    }
  }, []);

  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag)); 
    } else {
      setSelectedTags([...selectedTags, tag]); 
    }
  };

 
  const handleUpdate = () => {
    const currentFilters: FilterState = { minPrice, maxPrice, selectedTags };
    

    localStorage.setItem('userFilters', JSON.stringify(currentFilters));


    console.log("Update Button Clicked! Sending to Backend:", currentFilters);
    alert("Filters Applied! Check Console for data.");
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>Marketplace Filters</h3>

      {/* ---  (Price Slider) --- */}
      <div style={{ marginBottom: '20px' }}>
        <label>Price Range: ${minPrice} - ${maxPrice}</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="range" 
            min="0" max="500" 
            value={minPrice} 
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <input 
            type="range" 
            min="0" max="500" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      {/* ---  (Tags) --- */}
      <div style={{ marginBottom: '20px' }}>
        <label>Categories:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '5px 10px',
                borderRadius: '15px',
                border: '1px solid #007bff',
                cursor: 'pointer',
                
                backgroundColor: selectedTags.includes(tag) ? '#007bff' : 'white',
                color: selectedTags.includes(tag) ? 'white' : '#007bff'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ---  (Update Button) --- */}
      <button 
        onClick={handleUpdate}
        style={{ 
          width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' 
        }}
      >
        Update Results
      </button>
    </div>
  );
};