import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Layout from "./Layout";
import { isAuthenticated } from "./utils/auth";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/feed" /> : <LandingPage />
          }
        />

        {/* Protected Routes with Navbar Layout */}
        <Route element={<Layout />}>
          <Route
            path="/feed"
            element={isAuthenticated() ? <Feed /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:id"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
