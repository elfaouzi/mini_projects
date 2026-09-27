/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enables dark mode using a class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures all React component files are scanned
  ],
  theme: {
    extend: {}, // You can extend Tailwind's default theme here
  },
  plugins: [], // Add plugins if needed
};


