import Navbar from "../components/Navbar";
import React, { useState } from "react";

const LandingPage = ({ setIsLoggedIn }) => {
  const [name, setName] = useState("");

  const statsData = [
    {
      value: "1.2k+",
      label: "Active Students",
      color: "text-blue-500",
    },
    {
      value: "500+",
      label: "Daily Posts",
      color: "text-green-500",
    },
    {
      value: "50+",
      label: "Active Projects",
      color: "text-orange-500",
    },
  ];

  const handleEnter = () => {
    if (name.trim() !== "") {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-100 dark:bg-[#10101041] rounded-xl shadow-md text-center"
            >
              <p
                className={`text-2xl sm:text-3xl font-bold ${stat.color}`}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
          Welcome to SPITverse
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-2xl mb-10 text-sm sm:text-base">
          Connect with your fellow students, share ideas, and build the future together.
          Choose a feature below to get started. <br />
          <span className="italic">The exclusive student social platform</span>
        </p>

        {/* Join Community Form */} 
        <div className="bg-gray-100 dark:bg-[#10101041] p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Join the Community
          </h2>
          <input
            type="text"
            placeholder="Your name or nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none mb-4 text-sm sm:text-base"
          />
          <button
            onClick={handleEnter}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-sm sm:text-base"
          >
            Enter SPITverse
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
