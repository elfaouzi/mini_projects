import { Link } from "react-router-dom";
import { useState } from "react";
import "./RegisterPage.css";

interface User {
    name: string;
    email: string;
    password: string;
}

export const RegisterPage = () => {
    const [userData, setUserData] = useState<User>({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newUser: User = {
            name: userData.name,
            email: userData.email,
            password: userData.password
        };

        try {
            const response = await fetch("http://localhost:3001/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            const result = await response.json();

            if (response.ok) {
                alert("User Registered Successfully!");
                // Optionally reset the form or redirect
                setUserData({ name: "", email: "", password: "" });
                window.location.href = "/";
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            alert("An error occurred while registering. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={userData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
};
