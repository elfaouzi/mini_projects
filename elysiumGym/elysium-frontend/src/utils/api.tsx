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
    const response = await apiClient.post<LoginResponse>('/login', { email, password });

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

// ANALYTICS / DASHBOARD
/**
 * Get analytics data for admin dashboard
 * Backend: GET /dashboard/charts
 * Optionally accepts params: { year, range }
 * Should return: { revenue: [{ month, revenue }], userDistribution: [{ name, value }] }
 */
export const getDashboardCharts = async (params?: any) => {
  const response = await apiClient.get('/dashboard/admin/analytics', { params });
  return response;
};

export const getUsers = async (params?: any) => {
  const response = await apiClient.get('dashboard/admin/users', { params });
  return response;
}

/**
 * Update user information
 * Backend: PUT /users/:id
 * Form data structure:
 * {
 *   fullName: string,
 *   email: string,
 *   phone: string,
 *   subscription?: string (for members),
 *   subscriptionStart?: string (for members),
 *   specialty?: string (for coaches),
 *   experience?: number (for coaches)
 * }
 */
export const updateUser = async (id: string | number, userData: any) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

// SEANCES / SESSIONS
//updateSeance

/**
 * Update an existing seance
 * Backend: PUT /seances/:id
 * Form data structure:
 * {
 *   title: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:mm),
 *   specialty: string,
 *   maxMembers: number,
 *   description?: string,
 *   duration?: number (in minutes)
 * }
 */
export const updateSeance = async (id: string | number, seanceData: any) => {
  const response = await apiClient.put(`/seances/${id}`, seanceData);
  return response.data;
}

// getCoachSeances
/**
 * Get all seances for a specific coach
 * Backend: GET /coach/seances
 * Optionally accepts params for filtering
 */
export const getCoachSeances = async (params?: any) => {
  const response = await apiClient.get('/coach/seances', { params });
  return response;
}
// create seance

/**
 * Create a new seance
 * Backend: POST /seances
 * Form data structure:
 * {
 *   title: string,
 *   date: string (YYYY-MM-DD),
 *   time: string (HH:mm),
 *   specialty: string,
 *   maxMembers: number,
 *   description?: string,
 *   duration?: number (in minutes)
 * }
 */
export const createSeance = async (seanceData: any) => {
  const response = await apiClient.post('/seances', seanceData);
  return response.data;
}

/**
 * Get all seances
 * Backend: GET /seances
 * Optionally accepts params for filtering
 */

export const getSeances = async (params?: any) => {
  const response = await apiClient.get('/seances', { params });
  return response;
};

/**
 * Get all available seances for members to reserve
 * Backend: GET /member/seances/available
 * Returns seances that are active and not fully booked
 */
export const getAvailableSeances = async (params?: any) => {
  const response = await apiClient.get('/member/seances/available', { params });
  return response;
};

/**
 * Reserve a seance for the current member
 * Backend: POST /member/seances/:seanceId/reserve
 * Automatically uses authenticated member ID from JWT token
 */
export const reserveSeance = async (seanceId: string | number ,userId : string) => {
  const response = await apiClient.post(`/member/seances/${seanceId}/reserve/${userId}`);
  return response.data;
};

/**
 * Get all reserved seances for a specific member
 * Backend: GET /member/seances/:memberId
 * Returns seances that the member has reserved
 */
export const getMemberSeancesReserved = async (memberId: string | number, params?: any) => {
  const response = await apiClient.get(`/member/seances/${memberId}`, { params });
  return response;
};

/**
 * Cancel a seance reservation for the current member
 * Backend: DELETE /member/seances/:seanceId/reserve
 */
export const cancelReservation = async (seanceId: string | number) => {
  const response = await apiClient.delete(`/member/seances/${seanceId}/reserve`);
  return response.data;
};

// PAYMENTS
/**
 * Get all payments
 * Backend: GET /payments
 */
export const getPayments = async (params?: any) => {
  const response = await apiClient.get('/payments', { params });
  return response;
};
