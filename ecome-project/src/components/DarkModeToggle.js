import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className="text-center mb-4">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-gray-800 text-white rounded-lg dark:bg-gray-300 dark:text-gray-800"
            >
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </div>
    );
};

export default DarkModeToggle;
