import React from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("data"));

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/"); 
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#1A1A1A] transition-colors duration-300">
      {/* Brand */}
      <div
        className="text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
        onClick={() => navigate("/")}
      >
        SpitVerse
      </div>

      <div className="flex items-center gap-4">
        {/* If logged in, show buttons */}
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/create-project")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Create Project
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : null}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-transparent cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-300"
        >
          {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
