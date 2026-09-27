import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
import { RegisterPage } from "./pages/register";
import HomePage from "./pages/home";
import { DashbordPage } from "./pages/dashboard";
import Layout from "./layouts";

const App = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isConnected = localStorage.getItem("isConnected") === "true";

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            !isConnected ? (
              <LoginPage />
            ) : (
              // If already connected, redirect based on role
              <Navigate to={isAdmin ? "/dashboard" : "/home"} replace />
            )
          }
        />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Admin Route (without Layout/Navbar) */}
        <Route
          path="/dashboard"
          element={
            isConnected && isAdmin ? (
              <Layout>
              <DashbordPage />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Protected User Home Route (with Layout/Navbar) */}
        <Route
          path="/home"
          element={
            isConnected && !isAdmin ? (
              <Layout>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
