import { useState, useEffect } from "react";
import { getProducts, addProduct } from "../../utils/indexedDB"; // Assuming these are functions that interact with IndexedDB

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedProducts = await getProducts(); // Get products from IndexedDB
        setProducts(storedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addNewProduct = async (newProduct) => {
    try {
      await addProduct(newProduct); // Add new product to IndexedDB
      setProducts((prevProducts) => [...prevProducts, newProduct]); // Update state with the new product
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return {
    products,
    addProduct: addNewProduct, // Exposing addProduct function
  };
};
