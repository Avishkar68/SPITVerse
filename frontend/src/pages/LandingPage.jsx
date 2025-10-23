import React, { useState } from "react";
import Navbar from "../components/Navbar"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input"; 

const LandingPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleEnter = async () => {
    // Note: The backend will now only check for name if the user doesn't exist.
    if (!password.trim() || !email.trim()) {
      setError("Email and password are required.");
      return;
    }
    // Allow name to be empty here, but require it for new user registration on the backend.

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login", 
        {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        // Ensure headers are set correctly
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.setItem("data", JSON.stringify(res.data));
      
      navigate("/feed", { replace: true });
      window.location.reload(); 

    } catch (err) {
      console.error("Login/Register Error:", err);
      const message = err.response?.data?.message || "Login failed. Check your network or contact support.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { value: "1.2k+", label: "Active Students", color: "text-indigo-500" },
    { value: "500+", label: "Daily Posts", color: "text-green-500" },
    { value: "50+", label: "Active Projects", color: "text-pink-500" },
  ];
  
  const cardBaseClasses = "bg-white dark:bg-[#1A1A1A] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors duration-300";
  const buttonClasses = "w-full px-5 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors duration-200 text-lg shadow-md disabled:bg-gray-500";
  
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-center text-gray-800 dark:text-gray-100">
          Connect in <span className="text-indigo-600 dark:text-indigo-400">SPITverse</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mb-12">
          The exclusive student platform to collaborate, share knowledge, and build the future together.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`${cardBaseClasses} p-6 text-center`}
            >
              <p className={`text-4xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-md font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Login/Register Form */}
        <div className={`${cardBaseClasses} p-6 sm:p-8 w-full max-w-md text-center`}>
          <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
            Login or Register (SPIT.AC.IN Email required)
          </h2>

          {error && <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}

          <div className="space-y-4">
              <Input
                type="text"
                placeholder="Your Nickname / Full Name (Required for new users)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!email.trim() || !password.trim()} // Simple client-side UX hint
              />
              <Input
                type="email"
                placeholder="Your @spit.ac.in Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </div>
          
          <button 
            onClick={handleEnter}
            disabled={loading || !email.trim() || !password.trim()}
            className={`${buttonClasses} mt-8`}
          >
            {loading ? "Processing..." : "Enter SPITverse"}
          </button>
          
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
              If your email is new, an account will be created automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;