import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <LandingPage setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="/home"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
