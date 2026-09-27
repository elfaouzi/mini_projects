import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, DollarSign, Home, Settings as SettingsIcon, ClipboardList, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { clearUserInfo } from '../../app/store/userSlice';
import type { RootState } from '../../app/store/store';

const navItems = [
  { to: '/member', icon: Home, label: 'Dashboard' },
  { to: '/member/myseances', icon: ClipboardList, label: 'My Seances' },
  { to: '/member/reserve', icon: Calendar, label: 'Reserve Seance' },
  { to: '/member/settings', icon: SettingsIcon, label: 'Settings' },
];

const MemberLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear Redux state
      dispatch(clearUserInfo());
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('UserInfo');
      
      // Redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#232526] to-[#414345]">
      <nav className="fixed top-0 left-0 h-screen bg-[#18181b] w-64 p-6 flex flex-col justify-between shadow-2xl rounded-tr-3xl rounded-br-3xl border-r-4 border-yellow-400 z-10">
        <div>
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-8 tracking-widest text-center drop-shadow-lg">✨ Elysium Member</h2>
          <ul className="space-y-3">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md hover:scale-105 hover:bg-yellow-400/90 hover:text-[#18181b] ${
                    location.pathname === to
                      ? 'bg-yellow-400 text-[#18181b] scale-105'
                      : 'text-yellow-100 hover:text-[#18181b]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* User Profile Section */}
        <div className="pt-6 border-t border-yellow-400/30">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-yellow-400/10 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <User className="text-gray-800 text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 font-semibold text-sm truncate">
                {userInfo?.name || 'Member'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-lg cursor-pointer transition-all bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 border border-red-600/30 hover:border-red-500/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </motion.button>
        </div>
        
        <div className="text-xs text-yellow-200 text-center opacity-70 mt-4">© 2025 Elysium Gym</div>
      </nav>
      <main className="flex-1 bg-gradient-to-br from-[#232526]/80 to-[#ffd700]/10 overflow-auto min-h-screen ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberLayout;