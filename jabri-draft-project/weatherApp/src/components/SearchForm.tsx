import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (city: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [city, setCity] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Debounce function to delay API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: any;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch city suggestions from OpenWeatherMap API
  const fetchCitySuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10&addressdetails=1`
      );
      const data = await response.json();
      console.log(data);
      const cityList = data
      .map((item: any) => {
        return item.addresstype === "city" ? `${item.address.city} ,${item.address.country} ` : null;
      })
      .filter(Boolean); // Remove null values from the list
      console.log(cityList);

      setSuggestions(cityList);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Call the debounced function on user input
  const debouncedFetchCitySuggestions = debounce(fetchCitySuggestions, 100);

  // Handle input change and search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCity(query);
    debouncedFetchCitySuggestions(query);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setSuggestions([]);
    onSearch(selectedCity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) onSearch(city);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={handleChange}
          placeholder="Search for a city..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {suggestions.length > 0 && (
        <select className="city-select" onChange={handleSelect} size={5}>
          {suggestions.map((suggestion, index) => (
            <option key={index} value={suggestion}>
              {suggestion}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchForm;
