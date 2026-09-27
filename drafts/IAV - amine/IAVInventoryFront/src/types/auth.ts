// User types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role?: 'admin' | 'employee' | 'manager';
  created_at: string;
  updated_at: string;
}

// Login response from your backend
export interface LoginResponse {
  status: string;
  message: string;
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

// Login request data
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
