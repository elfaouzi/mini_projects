import React, { useState, useEffect } from "react";
import { motion ,useAnimation} from "framer-motion";
import closedBoxUrl from "./../../assets/cardboard-box.png";
import openBoxUrl from "./../../assets/mockup-empty-carton-box-isolated-white-background-ai-generative.png";
import { getProducts, addProduct } from "../../utils/indexedDB"; // Import the functions

const HeroSection = ({products, setProducts} ) => {
  const [formVisible, setFormVisible] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState("");
  const controls = useAnimation();

  // Load products from IndexedDB on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedProducts = await getProducts();
        setProducts(storedProducts);
        console.log("Products loaded from IndexedDB:", storedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Toggle form visibility
  const toggleForm = () => {
    setFormVisible(!formVisible);
  };

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result); // Base64 representation
        setImagePreview(reader.result); // Preview the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productDescription || !productPrice || !productImage || !category) {
      alert("All fields are required!");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice).toFixed(2),
      image: productImage,
      category,
    };

    try {
      await addProduct(newProduct); // Store in IndexedDB
      setProducts((prevProducts) => [...prevProducts, newProduct]); // Update state

      // Clear form fields
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImage("");
      setCategory("");
      setFormVisible(false); // Hide the form
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    controls.start({ y: scrollY * 0.5 });  // Adjust speed for parallax
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="hero-section relative  h-screen flex flex-row items-center justify-between p-10 text-white">
      {/* Parallax background */}
      <motion.div 
        animate={controls}
        transition={{ type: 'spring', stiffness: 100 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/path-to-your-image.jpg)',  // Replace with your image path
        }}
      ></motion.div>

      {/* Left Column: Box Image (Toggles Form) */}
      <div className="w-1/3 flex justify-center items-center z-10">
        <motion.img
          src={formVisible ? openBoxUrl : closedBoxUrl}
          alt={formVisible ? "Open Box" : "Closed Box"}
          onClick={toggleForm}
          className={`w-44 h-32 cursor-pointer ${formVisible ? 'drop-shadow-[5px_20px_5px_rgba(0,0,0,0.8)]' : 'drop-shadow-[-5px_15px_5px_rgba(0,0,0,0.8)]'}`}
          initial={{ scale: 1, rotate: 0 }}
          animate={{ scale: formVisible ? 1.2 : 1, rotate: formVisible ? 35 : 0 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Right Column: Form */}
      <div className="w-2/3 flex justify-start items-center relative z-10">
        <motion.div
          initial={{ x: "-80%", y: "-50%", scale: 0.1, opacity: 0 }}
          animate={{
            x: formVisible ? "0%" : "-80%",
            y: formVisible ? "0%" : "-10%",
            scale: formVisible ? 1 : 0,
            opacity: formVisible ? 1 : -0.5,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white w-full max-w-4xl h-auto rounded-lg p-6 shadow-lg"
          style={{ marginTop: "80px" }} // Add space to avoid overlap with navbar
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Product Details</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* First Row: Product Name, Price, Category */}
            <div>
              <label htmlFor="productName" className="text-gray-700 font-medium mb-1 block">
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-3 text-gray-500 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="productPrice" className="text-gray-700 font-medium mb-1 block">
                Product Price
              </label>
              <input
                type="number"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-3 text-gray-500 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="text-gray-700 font-medium mb-1 block">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm bg-white text-gray-700 hover:bg-gray-100"
              >
                <option value="" disabled className="text-gray-500">
                  Select Category
                </option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="productImage" className="text-gray-700 font-medium mb-1 block">
                Product Image
              </label>
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* Second Row: Product Description */}
            <div className="md:col-span-2">
              <label htmlFor="productDescription" className="text-gray-700 font-medium mb-1 block">
                Product Description
              </label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full p-3 text-gray-500 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-md shadow-md"
              >
                Add Product
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
