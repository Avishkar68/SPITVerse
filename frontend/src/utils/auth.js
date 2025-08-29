// utils/auth.js
export const isAuthenticated = () => {
    const data = localStorage.getItem("data");
    return Boolean(data);
  };
  