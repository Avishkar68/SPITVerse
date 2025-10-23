// Simplified and Professional Input Component

"use client";
import * as React from "react";
import { cn } from "../../utils/auth";
// Removed useMotionTemplate, useMotionValue, motion imports for performance

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    // Replaced motion.div with a standard div
    <div className="group/input rounded-lg transition duration-300">
      <input
        type={type}
        className={cn(
          // Cleaned up existing styles for better focus and dark mode consistency
          `flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 
           bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-black dark:text-white
           placeholder:text-gray-500 dark:placeholder:text-gray-400 
           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200`,
          className
        )}
        ref={ref}
        {...props} 
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };