import React, { useState, useEffect } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#1A1A1A]  transition-colors duration-300">
      {/* Brand */}
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        SpitVerse
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-lg bg-transparent cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-300"
      >
        {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
      </button>
    </nav>
  );
};

export default Navbar;
