
import axios from "axios";

// Create an instance with default config
const api = axios.create({
  baseURL: "/api/v1", // change to your backend API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
