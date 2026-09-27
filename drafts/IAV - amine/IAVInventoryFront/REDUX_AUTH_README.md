# IAV Inventory Frontend - Redux Authentication System

## Overview

This React + TypeScript application now uses **Redux Toolkit** with **Redux Persist** for secure authentication state management. The system includes role-based access control, secure token storage, and proper routing.

## Features

### 🔐 Authentication
- **JWT Access Tokens**: Stored in memory only (not in localStorage)
- **Refresh Tokens**: Stored as HTTP-only cookies
- **Redux Persist**: Persists auth state across browser sessions securely
- **Automatic Token Refresh**: Handles token refresh automatically via Axios interceptors

### 👥 Role-Based Access Control
- **Admin**: Full system administration access
- **Employee**: Inventory management access
- **Viewer**: Read-only access

### 🛣️ Routing
- **Public Routes**: 
  - `/` - Home page (inventory overview for all users)
  - `/login` - Login page
  - `/unauthorized` - Access denied page
- **Protected Routes**:
  - `/admin` - Admin-only dashboard
  - `/dashboard` - Employee/Viewer dashboard

## Architecture

### Store Structure
```
src/store/
├── index.ts                 # Redux store configuration with persistence
└── slices/
    └── authSlice.ts         # Authentication slice with async thunks
```

### Authentication Flow
```
src/hooks/
├── redux.ts                 # Typed Redux hooks
└── useAuth.ts              # Custom auth hook with role checks
```

### Components
```
src/pages/
├── Home.tsx                 # Public inventory overview
├── Login.tsx                # Login form with Redux integration
├── Unauthorized.tsx         # Access denied page
└── dashboards/
    ├── AdminDashboard.tsx   # Admin-specific dashboard
    └── EmployeeDashboard.tsx # Employee/Viewer dashboard
```

### Routing & Protection
```
src/routes/
└── ProtectedRoute.tsx       # Role-based route protection
```

## Security Features

### 🔒 Token Security
- Access tokens stored in memory only
- Refresh tokens in HTTP-only cookies
- Automatic token clearing on logout
- No sensitive data in localStorage/sessionStorage

### 🛡️ Route Protection
- Authentication checks on all protected routes
- Role-based access control
- Unauthorized access redirects
- Preserved intended destinations after login

### 🔄 State Management
- Redux Persist with secure whitelist
- State rehydration on app reload
- Automatic cleanup on authentication failures

## Usage

### Starting the Application
```bash
npm run dev
```

### Login Flow
1. User submits credentials on `/login`
2. Redux thunk handles authentication
3. Access token stored in memory
4. Refresh token stored as HTTP-only cookie
5. User redirected based on role:
   - Admin → `/admin`
   - Employee/Viewer → `/dashboard`

### Authentication Hooks
```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    isAdmin, 
    isEmployee, 
    login, 
    logout 
  } = useAuth();
  
  // Component logic
};
```

### Role-Based Components
```typescript
import ProtectedRoute from '../routes/ProtectedRoute';

// Admin only
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// Multiple roles allowed
<ProtectedRoute allowedRoles={['employee', 'admin']}>
  <EmployeeDashboard />
</ProtectedRoute>
```

## API Integration

### Backend Requirements
The backend must implement these endpoints:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - User profile

### User Response Format
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'viewer';
  permissions?: string[];
}
```

## Configuration

### Vite Proxy (Development)
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Redux Store
```typescript
// Persisted state configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};
```

## Development

### Adding New Roles
1. Update `UserRole` type in `src/types/auth.ts`
2. Add role checks in `useAuth` hook
3. Update route protection logic
4. Create role-specific dashboard if needed

### Adding New Protected Routes
```typescript
<ProtectedRoute requiredRole="newRole">
  <NewComponent />
</ProtectedRoute>
```

### Debugging
- Redux DevTools enabled in development
- Console logging for auth actions
- Network tab shows API requests
- Auth state visible in Redux DevTools

## Security Best Practices

✅ **Implemented**:
- Access tokens in memory only
- HTTP-only cookies for refresh tokens
- Automatic token cleanup
- Role-based access control
- Protected route guards
- Secure state persistence

⚠️ **Backend Requirements**:
- Implement CORS properly
- Use secure HTTP-only cookies
- Validate JWT tokens server-side
- Rate limiting on auth endpoints
- Input validation and sanitization

## Demo Credentials

For testing purposes:
- **Admin**: `admin@example.com` / `password`
- **Employee**: `employee@example.com` / `password`
- **Viewer**: `viewer@example.com` / `password`

## Next Steps

1. **Backend Integration**: Implement Laravel auth endpoints
2. **Testing**: Add unit tests for auth flows
3. **Error Handling**: Enhance error messages and recovery
4. **Performance**: Optimize re-renders and API calls
5. **Documentation**: API documentation for backend team

---

**Note**: This system is production-ready for the frontend. Ensure your Laravel backend implements proper JWT authentication with HTTP-only refresh token cookies for complete security.
