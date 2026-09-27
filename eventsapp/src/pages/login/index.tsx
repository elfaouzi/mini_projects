import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the entered credentials are admin
    if (email === "admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isConnected", "true");
      localStorage.setItem("userData", JSON.stringify({ name:'admin' ,email: "admin", password: "admin" }));
        window.location.href = "/dashboard";
      return;
    }

    try {
      // Fetch users from db.json
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();

      // Find user in the database
      const user = users.find(
        (u: { email: string; password: string }) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isConnected", "true");
        localStorage.setItem("userData", JSON.stringify(user));
        window.location.href = "/home";
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type={email === "admin" ? "text" : "email"}
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
