import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { setAccessToken } from '../../api/axios';
import type { User, LoginCredentials, UserRole } from '../../types/auth';

// Use the User type from types/auth.ts which already includes role
export type AuthUser = User;

// Auth state interface
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('🚀 Redux: Attempting login...');
      const response = await authService.login(credentials);
      
      // Set the access token in axios
      
      console.log('✅ Redux: Login successful');
      return {
        user: response.user as AuthUser,
        accessToken: response.accessToken,
      };
    } catch (error: any) {
      console.error('❌ Redux: Login failed:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚪 Redux: Logging out...');
      await authService.logout();
      
      // Clear the access token from axios
      
      console.log('✅ Redux: Logout successful');
      return;
    } catch (error: any) {
      console.error('❌ Redux: Logout error:', error);
      // Still clear local state even if backend call fails
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Refreshing token...');
      const response = await authService.refreshToken();
      
      // Set the new access token in axios
      
      console.log('✅ Redux: Token refreshed');
      return {
        accessToken: response.accessToken,
      };
    } catch (error: any) {
      console.error('❌ Redux: Token refresh failed:', error);
      // Clear tokens on refresh failure
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('👤 Redux: Fetching user profile...');
      const user = await authService.getProfile();
      
      console.log('✅ Redux: User profile fetched');
      return user as AuthUser;
    } catch (error: any) {
      console.error('❌ Redux: Failed to fetch user profile:', error);
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear auth state (for manual logout)
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Still clear auth state even if logout request failed
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, () => {
        // Don't set loading for token refresh to avoid UI flicker
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, clearAuth, setLoading } = authSlice.actions;

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectHasRole = (role: UserRole) => (state: { auth: AuthState }) => 
  state.auth.user?.role === role;
export const selectHasPermission = (permission: string) => (state: { auth: AuthState }) => 
  state.auth.user?.permissions?.includes(permission) || false;

// Export reducer
export default authSlice.reducer;
