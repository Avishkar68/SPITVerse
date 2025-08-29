import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleEnter = async () => {
    if (!name.trim() || !password.trim() || !email.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        name,
        email,
        password,
      });

      localStorage.setItem("data", JSON.stringify(res.data));
      // Redirect to feed
      navigate("/feed");
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [{ value: "1.2k+", label: "Active Students", color: "text-blue-500" }, { value: "500+", label: "Daily Posts", color: "text-green-500" }, { value: "50+", label: "Active Projects", color: "text-orange-500" },];
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 bg-transparent dark:bg-[#10101041] rounded-xl shadow-sm text-center"
            >
              <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">
          Welcome to SPITverse
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-center max-w-2xl mb-4 text-sm sm:text-base">
          Connect with your fellow students, share ideas, and build the future together.
          Choose a feature below to get started. <br />
          <span className="italic">The exclusive student social platform</span>
        </p>

        {/* Join Community Form */}
        <div className="bg-transparent dark:bg-[#10101041] p-4 sm:p-4 rounded-xl shadow-2xs w-full max-w-md text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Join the Community
          </h2>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <input
            type="text"
            placeholder="Your nickname or username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none mb-4 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none mb-4 text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none mb-4 text-sm sm:text-base"
          />
          <button onClick={handleEnter}>
            {loading ? "Logging in..." : "Enter SPITverse"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
