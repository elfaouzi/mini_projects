// App.jsx or Routes.jsx
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AddUser from './pages/admin/AddUser';
import Seances from './pages/admin/Seances';
import Settings from './pages/admin/Settings';
import ManageUsers from './pages/admin/ManageUsers';
import PaymentsPage from './pages/admin/Payments';
import AnalyticsPage from './pages/admin/Analytics';
import AddSeance from './pages/coach/AddSeance';
import MySeances from './pages/coach/MySeances';
import MySeancesReserved from './pages/member/MySeances';
import CoachMembers from './pages/coach/Members';
import CoachPayments from './pages/coach/Payments';
import CoachProfile from './pages/coach/Profile';
import CoachSettings from './pages/coach/Settings';

// Components
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/layouts/AdminLayout';
import CoachLayout from './components/layouts/CoachLayout';
import MemberLayout from './components/layouts/MemberLayout';
import CoachDashboard from './pages/coach/Dashboard';
import MemberDashboard from './pages/member/Dashboard';
import HomeRedirect from './utils/HomeRedirect';
import { configureInterceptors } from './utils/apiClient';


const Reserve = React.lazy(() => import('./pages/member/Reserve'));
const MemberPayments = React.lazy(() => import('./pages/member/Payments'));
const MemberProfile = React.lazy(() => import('./pages/member/Profile'));
const MemberSettings = React.lazy(() => import('./pages/member/Settings'));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    configureInterceptors(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/not-allowed" element={<div>Access Denied</div>} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="seances" element={<Seances />} />
            <Route path="settings" element={<Settings />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>

        {/* Coach Routes */}
        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
          <Route path="/coach" element={<CoachLayout />}>
            <Route index element={<CoachDashboard />} />
            <Route path="dashboard" element={<CoachDashboard />} />
            <Route path="my-seances" element={<MySeances />} />
            <Route path="add-seance" element={<AddSeance />} />
            <Route path="members" element={<CoachMembers />} />
            <Route path="payments" element={<CoachPayments />} />
            <Route path="profile" element={<CoachProfile />} />
            <Route path="settings" element={<CoachSettings />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Route>

        {/* Adherent Routes */}
        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<MemberDashboard />} />
            <Route path="myseances" element={<Suspense fallback={<div>Loading...</div>}><MySeancesReserved /></Suspense>} />
            <Route path="reserve" element={<Suspense fallback={<div>Loading...</div>}><Reserve /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<div>Loading...</div>}><MemberPayments /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<div>Loading...</div>}><MemberProfile /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<div>Loading...</div>}><MemberSettings /></Suspense>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
