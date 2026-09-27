import React from "react";
import { motion } from "framer-motion";

const ProductCard = ({ product, onEdit }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col justify-between overflow-hidden transform transition-all duration-300 ease-in-out"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        backgroundColor: "#f9fafb", // Light background change on hover
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Product Image */}
      <div className="w-full h-48 flex justify-center items-center overflow-hidden rounded-lg shadow-md mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-all duration-200">
          {product.name}
        </h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-blue-600 font-bold mt-3 text-lg">{`$${product.price}`}</p>
      </div>

      {/* Edit Button */}
      <button
        className="mt-4 py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-all duration-200 transform hover:scale-105"
        onClick={() => onEdit(product)}
      >
        Edit
      </button>
    </motion.div>
  );
};

export default ProductCard;
