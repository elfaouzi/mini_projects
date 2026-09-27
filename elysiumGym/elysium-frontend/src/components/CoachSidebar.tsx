import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FaTachometerAlt, FaCalendarAlt, FaPlusCircle, FaUsers, FaMoneyBillWave, FaUserCircle, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { clearUserInfo } from '../app/store/userSlice';
import type { RootState } from '../app/store/store';

const navLinks = [
  { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/coach/dashboard' },
  { name: 'My Seances', icon: <FaCalendarAlt />, path: '/coach/my-seances' },
  { name: 'Add Seance', icon: <FaPlusCircle />, path: '/coach/add-seance' },
  { name: 'Members', icon: <FaUsers />, path: '/coach/members' },
  { name: 'Payments', icon: <FaMoneyBillWave />, path: '/coach/payments' },
  { name: 'Profile', icon: <FaUserCircle />, path: '/coach/profile' },
  { name: 'Settings', icon: <FaCog />, path: '/coach/settings' },
];

const CoachSidebar = () => {
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
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl flex flex-col p-6">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <span className="text-3xl text-yellow-400 font-extrabold tracking-widest">Elysium</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {navLinks.map(link => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link key={link.name} to={link.path} className="relative">
              <motion.div
                initial={false}
                animate={isActive ? { scale: 1.08, backgroundColor: '#FFD700', color: '#222' } : { scale: 1, backgroundColor: 'rgba(0,0,0,0)', color: '#fff' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl font-semibold text-lg cursor-pointer transition-colors ${isActive ? 'shadow-xl' : 'hover:bg-gray-700/60'}`}
              >
                <span className="text-2xl">{link.icon}</span>
                <span>{link.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-6 border-t border-gray-600">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-gray-700/50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-800 text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {userInfo?.name || 'Coach'}
            </p>
           
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-xl font-semibold text-lg cursor-pointer transition-all bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 border border-red-600/30 hover:border-red-500/50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="text-2xl">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default CoachSidebar;
