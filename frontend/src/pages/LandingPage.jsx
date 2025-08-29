import Navbar from "../components/Navbar";
import React, { useState } from "react";

const LandingPage = ({ setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const statsData = [
    { value: "1.2k+", label: "Active Students", color: "text-blue-500" },
    { value: "500+", label: "Daily Posts", color: "text-green-500" },
    { value: "50+", label: "Active Projects", color: "text-orange-500" },
  ];

  const handleEnter = () => {
    if (name.trim() && password.trim() !== "") {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 bg-transparent dark:bg-[#10101041] rounded-xl shadow-sm text-center"
            >
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="text-center px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Welcome to SPITverse
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm max-w-xl">
            Connect with your fellow students, share ideas, and build the future together.
            <br />
            <span className="italic">The exclusive student social platform</span>
          </p>
        </div>

        {/* Join Community Form */}
        <div className="bg-transparent dark:bg-[#10101041] p-4 sm:p-6 rounded-xl shadow-sm w-full max-w-sm text-center">
          <h2 className="text-base sm:text-lg font-semibold mb-3">
            Join the Community
          </h2>
          <input
            type="text"
            placeholder="Your nickname or username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none mb-3 text-sm"
          />
          <input
            type="text"
            placeholder="Your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none mb-3 text-sm"
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none mb-3 text-sm"
          />
          <button
            onClick={handleEnter}
            className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-sm"
          >
            Enter SPITverse
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
