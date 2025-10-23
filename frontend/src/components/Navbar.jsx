import React from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const isLoggedIn = Boolean(localStorage.getItem("data"));

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/", { replace: true }); 
    window.location.reload(); 
  };
  
  const handleDarkModeToggle = () => {
      setDarkMode(prev => !prev);
  };

  return (
    // 💡 CLEANED FIX: Removed all JavaScript comments inside the className string
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 
                    bg-white/50 dark:bg-[#1A1A1A]/80 
                    backdrop-blur-md 
                    border-b border-gray-200/50 dark:border-gray-700/50
                    shadow-lg dark:shadow-none transition-colors duration-300"
    >
      
      <Link
        to={isLoggedIn ? "/feed" : "/"} 
        className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 cursor-pointer"
      >
        SpitVerse
      </Link>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/feed?type=project" 
              className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200 text-sm shadow-md"
            >
              Create Project
            </Link>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </>
        ) : null}

        <button
          onClick={handleDarkModeToggle}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200 transition-colors duration-300"
        >
          {darkMode ? <MdOutlineLightMode size={24} /> : <MdOutlineDarkMode size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;