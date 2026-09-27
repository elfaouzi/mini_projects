# 🔐 JWT Authentication System

A secure React + TypeScript authentication system using JWT access tokens and HTTP-only refresh tokens.

## 🛡️ Security Features

- **Access Token**: Stored in memory (React Context state) - never in localStorage
- **Refresh Token**: Stored in HTTP-only cookies (managed by backend)
- **Automatic Token Refresh**: Axios interceptors handle expired tokens seamlessly
- **XSS Protection**: No tokens in localStorage/sessionStorage
- **CSRF Protection**: HTTP-only cookies prevent client-side token theft

## 📁 Project Structure

```
src/
├── api/
│   └── axios.ts              # Axios instance with interceptors
├── auth/
│   ├── AuthProvider.tsx      # Auth context provider
│   └── useAuth.ts           # Custom auth hook
├── pages/
│   ├── Login.tsx            # Login form
│   └── Dashboard.tsx        # Protected dashboard
├── routes/
│   └── ProtectedRoute.tsx   # Route protection component
├── services/
│   └── authService.ts       # API service calls
├── types/
│   └── auth.ts             # TypeScript interfaces
├── App.tsx                 # Main app with routes
└── main.tsx               # App entry point
```

## 🔄 Authentication Flow

### Login Process
1. User submits login form
2. `authService.login()` calls `/auth/login`
3. Backend returns `{ accessToken, user }` + sets refresh token cookie
4. AuthProvider stores access token in memory and user data
5. User is redirected to dashboard

### Protected Route Access
1. User navigates to protected route
2. ProtectedRoute checks `isAuthenticated` from AuthProvider
3. If not authenticated, redirects to login
4. If authenticated, renders the protected component

### API Requests
1. Axios interceptor adds `Authorization: Bearer <accessToken>` header
2. If request returns 401:
   - Interceptor calls `/auth/refresh` with HTTP-only cookie
   - Backend returns new access token
   - Original request is retried with new token
   - If refresh fails, user is redirected to login

### Logout Process
1. User clicks logout
2. `authService.logout()` calls `/auth/logout`
3. Backend clears refresh token cookie
4. AuthProvider clears access token and user data
5. User is redirected to login page

## 🌐 API Endpoints

### Backend Requirements

Your Laravel backend should implement these endpoints:

```php
// Login - returns access token, sets refresh token cookie
POST /auth/login
Body: { email, password }
Response: { accessToken, user }
Sets: HTTP-only cookie with refresh token

// Refresh access token
POST /auth/refresh
Requires: refresh token cookie
Response: { accessToken }

// Get user profile (protected)
GET /auth/profile
Requires: Authorization header with access token
Response: { user }

// Logout - clears refresh token cookie
POST /auth/logout
Requires: refresh token cookie
Response: success message
```

## 🎯 Key Components

### AuthProvider
- Manages authentication state (user, accessToken, isAuthenticated)
- Provides login/logout/refresh functions
- Initializes auth state on app load by trying to refresh token

### useAuth Hook
- Custom hook to consume auth context
- Provides type-safe access to auth state and functions
- Throws error if used outside AuthProvider

### Axios Configuration
- Base URL configuration
- Request interceptor adds auth headers
- Response interceptor handles token refresh
- Automatic redirect on authentication failure

### ProtectedRoute
- Wrapper component for protected pages
- Shows loading spinner while checking auth
- Redirects to login if not authenticated
- Preserves intended destination for post-login redirect

## 🚀 Usage

### Login Form
```tsx
const { login, isLoading, isAuthenticated } = useAuth();

const handleLogin = async (credentials) => {
  try {
    await login(credentials);
    // User will be redirected automatically
  } catch (error) {
    // Handle login error
  }
};
```

### Protected Component
```tsx
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Route Protection
```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Axios Base Configuration
```typescript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Required for HTTP-only cookies
});
```

## 🛠️ Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Authentication:**
   - Navigate to `/dashboard` (should redirect to login)
   - Use demo credentials: `admin@example.com` / `password`
   - Should redirect to dashboard after successful login

3. **Test Token Refresh:**
   - Make API calls after token expiration
   - Should automatically refresh and retry requests

## 🔒 Security Best Practices

✅ **Implemented:**
- Access tokens in memory only
- Refresh tokens in HTTP-only cookies
- Automatic token refresh
- CORS configuration with credentials
- Request/response interceptors for seamless auth

✅ **Recommended Backend Practices:**
- Short-lived access tokens (15-30 minutes)
- Longer-lived refresh tokens (7-30 days)
- Refresh token rotation on each use
- Rate limiting on auth endpoints
- HTTPS in production

## 📱 Demo Credentials

For testing purposes:
- **Email:** admin@example.com
- **Password:** password

*Note: Update these credentials and remove this section in production.*
