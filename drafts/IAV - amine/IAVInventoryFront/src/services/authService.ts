import axios from 'axios';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = 'login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('auth/login', credentials);
      const { token } = response.data;
      
      // Store token in localStorage
      this.setToken(token);
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<User>('/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get user from Redux store or localStorage if needed
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('persist:root');
      if (userStr) {
        const persistData = JSON.parse(userStr);
        const userData = JSON.parse(persistData.user);
        return userData.userInfo || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();
