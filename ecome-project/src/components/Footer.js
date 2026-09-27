import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-2xl font-bold">Company Name</h3>
            <p className="mt-4 text-gray-400">Creating amazing experiences through technology.</p>
          </motion.div>
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="mt-4">
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <a href="/" className="text-gray-400 hover:text-blue-500">
                  Home
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <a href="#about-us" className="text-gray-400 hover:text-blue-500">
                  About Us
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <a href="#contact" className="text-gray-400 hover:text-blue-500">
                  Contact
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <a href="/privacy-policy" className="text-gray-400 hover:text-blue-500">
                  Privacy Policy
                </a>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h4 className="text-xl font-semibold">Follow Us</h4>
            <div className="mt-4 flex justify-center md:justify-start space-x-6">
              <motion.a
                href="https://facebook.com"
                className="text-gray-400 hover:text-blue-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fab fa-facebook-f text-xl"></i>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                className="text-gray-400 hover:text-blue-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fab fa-twitter text-xl"></i>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                className="text-gray-400 hover:text-blue-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <i className="fab fa-linkedin-in text-xl"></i>
              </motion.a>
            </div>
          </motion.div>
        </div>
        <div className="text-center mt-8">
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            &copy; 2024 Company Name. All Rights Reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
