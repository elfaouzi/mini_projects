import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../utils/indexedDB';

const Navbar = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchInputRef = useRef(null);

  

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredProducts([]);
      return;
    }

    // Filter products based on the search term
    const results = products
      .filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 4);
    setFilteredProducts(results);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Handle search submission logic if needed
  };

  const handleProductClick = (product) => {
    console.log('Selected product:', product);
    setSearchTerm(product.name); // Set the search term to the selected product
    setFilteredProducts([]); // Hide dropdown
  };

  const handleClickOutside = (event) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
      setFilteredProducts([]); // Hide dropdown
    }
  };
useEffect(() => {
    console.log('Products:', products);
    }, [products]);
  const handleFocus = () => {
    // Re-trigger search logic when the search bar is focused again
    if (searchTerm.trim() !== '') {
      const results = products
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 4);
      setFilteredProducts(results);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-3xl font-semibold tracking-wider font-sans">
          <a
            href="#home"
            className="text-white hover:text-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            E-Shop
          </a>
        </div>
  
        {/* Search Bar */}
        <div className="relative w-80" ref={searchInputRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white rounded-full shadow-lg px-4 py-2 w-full transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-blue-500"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              placeholder="Search for products..."
              className="outline-none w-full text-gray-700 placeholder-gray-500 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="text-yellow-500 p-2 rounded-full hover:text-yellow-700 transition-all duration-300 ease-in-out"
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
  
          {/* Dropdown Results */}
          {filteredProducts.length > 0 && (
            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              {filteredProducts.map((product, index) => (
                <li
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-200 transition-all duration-300 hover:rounded-lg ${index === 0 ? "hover:rounded-t-lg" : index === filteredProducts.length - 1 ? 'hover:rounded-b-lg' : ''}`}
                >
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md mr-3"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">{product.name}</p>
                      <p className="text-gray-500 text-sm">${product.price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Navbar Links */}
        <ul className="flex space-x-8 font-medium text-lg">
          <li>
            <a
              href="#home"
              className="text-white hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#products"
              className="text-white hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline"
            >
              Products
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-white hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-white hover:text-yellow-500 transition-all duration-300 ease-in-out hover:underline"
            >
              Contact
            </a>
          </li>
        </ul>
  
        {/* Cart Icon */}
        <div className="relative text-white hover:text-yellow-500 transition-all duration-300 ease-in-out text-2xl">
          <i className="fas fa-shopping-cart"></i>
          {/* Cart Badge */}
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {/* This can be dynamically generated based on cart items */}
            3
          </div>
        </div>
      </div>
    </nav>
  );
  
};

export default Navbar;
