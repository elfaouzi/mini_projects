import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductsSection({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedRange, setSelectedRange] = useState([0, 0]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Initialize price range and categories
  useEffect(() => {
    if (products.length) {
      const prices = products.map((p) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
      setSelectedRange([minPrice, maxPrice]);
    }
    const uniqueCategories = [...new Set(products.map((p) => p.category))];
    setCategories(uniqueCategories);
  }, [products]);

  // Filter products
  const filterProducts = () => {
    let result = products;

    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    result = result.filter(
      (product) =>
        product.price >= selectedRange[0] && product.price <= selectedRange[1]
    );

    setFilteredProducts(result);
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedRange, selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleRangeChange = (e, index) => {
    const newRange = [...selectedRange];
    newRange[index] = +e.target.value;

    // Prevent overlap of handles by adjusting the other handle
    if (newRange[0] > newRange[1]) {
      if (index === 0) newRange[1] = newRange[0];
      else newRange[0] = newRange[1];
    }

    setSelectedRange(newRange);
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar Filters */}
      <div className="w-1/4 p-6 shadow-lg sticky top-10 h-screen">
        <h2 className="text-2xl font-semibold mb-6">Filters</h2>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price Range Slider */}
        <div className="mb-6">
          <h3 className="text-lg font-medium">Price Range</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600">${selectedRange[0]}</span>
            <span className="text-gray-600">${selectedRange[1]}</span>
          </div>
          <div className="relative mt-2">
            <div className="range-slider">
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={selectedRange[0]}
                onChange={(e) => handleRangeChange(e, 0)}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
              />
              <input
                type="range"
                min={priceRange[0]}
                max={priceRange[1]}
                value={selectedRange[1]}
                onChange={(e) => handleRangeChange(e, 1)}
                className="absolute w-full h-2 bg-transparent appearance-none pointer-events-auto"
              />
              <div
                className="range-highlight"
                style={{
                  left: `${((selectedRange[0] - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                  right: `${100 - ((selectedRange[1] - priceRange[0]) / (priceRange[1] - priceRange[0])) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-medium">Categories</h3>
          <div className="mt-2">
            {categories.map((category) => (
              <label key={category} className="block mt-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="w-3/4 p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-white">
          Explore Our Products
        </h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.1,
                    duration: 0.8,
                    ease: "easeInOut",
                  },
                }}
                className="product-card"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-20">
            No products match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
