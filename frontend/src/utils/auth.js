
  import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// utils/auth.js
export const isAuthenticated = () => {
    const data = localStorage.getItem("data");
    return Boolean(data);
  };
  

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
