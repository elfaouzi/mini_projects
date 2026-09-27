import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className=" py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          About Us
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          We are a passionate team dedicated to creating innovative solutions and delivering exceptional experiences. Our goal is to push the boundaries of technology and make a lasting impact on the world through our projects.
        </motion.p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <motion.div
            className="relative rounded-lg overflow-hidden"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src="https://via.placeholder.com/200"
              alt="About Us Image"
              className="w-2/3 h-2/3 object-cover"
            />
          </motion.div>
          {/* Description Section */}
          <motion.div
            className="text-left"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
            <p className="text-lg text-gray-600 mt-4">
              Our mission is to provide cutting-edge solutions that empower individuals and businesses to thrive in the digital age. We believe in the power of creativity, collaboration, and technology to solve complex challenges and drive meaningful change.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
