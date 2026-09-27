import apiClient from "./apiClient";
import axios from "axios";

// Define types for the API response
interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
  };
}
interface RegisterResponse {
  message: string;
  user: {};
  password: string;
}

export const login = async (email: string, password: string) => {
  try {
    // Make the API call to login
    const response = await apiClient.post<LoginResponse>('auth/login', { email, password });

    const { token, user } = response.data;

    // Save token and user data to localStorage

    // Return token and user
    return { token, user };
  } catch (error: any) {
    // Handle specific error message from response
    if (error?.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    }
    // Default error message if no response data is available
    throw new Error('Login failed');
  }
};

export const register = async (formData : FormData) => {
  try {
   
    // Make the API call to register
    const response = await apiClient.post<RegisterResponse>('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { message, user,password } = response.data;

    // Save token and user data to localStorage

    // Return token and user
    return { message, user,password };
  } catch (error: any) {
    // Handle specific error message from response
    if (error?.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    }
    // Default error message if no response data is available
    throw new Error('Registration failed');
  }
}
