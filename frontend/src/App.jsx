import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/feed" />
            ) : (
              <LandingPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Protected Routes with Navbar Layout */}
        <Route element={<Layout />}>
          <Route
            path="/feed"
            element={isLoggedIn ? <Feed /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
