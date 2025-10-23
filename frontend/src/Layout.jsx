import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1A1A] transition-colors duration-300">
      <Navbar />
      <main className="">
        <Outlet /> {/* All child routes render here */}
      </main>
    </div>
  );
};

export default Layout;
