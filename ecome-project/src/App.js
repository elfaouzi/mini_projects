import { useState, useEffect } from "react";
import HeroSection from "./components/herosection/HeroSection";
import Navbar from "./components/Navbar";
import { getProducts } from "./utils/indexedDB";
import ProductsSection from "./components/productssection";
import AboutUs from "./components/Aboutus";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

function App() {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-400">
      <Navbar products={products} />
      <HeroSection products={products} setProducts={setProducts} />
      <ProductsSection products={products}></ProductsSection>
      <AboutUs></AboutUs>
      <ContactUs></ContactUs>
      <Footer></Footer>
    </div>
  );
}

export default App;
