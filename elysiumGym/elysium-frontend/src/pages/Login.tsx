import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../app/store/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const { token, user } = await login(email, password);
      if(!token || !user) {
        setError('Invalid email or password');
        setShowError(true);
        return;
      }
      dispatch(setUserInfo({ user, token }));
      localStorage.setItem('token', token);
      console.log('User:', user.role);
      if (user.role === 'admin') {
        navigate('/admin');
      }
      else if (user.role === 'coach') {
        navigate('/coach');
      } else if (user.role === 'member') {
        navigate('/member');
      } else {
        setError('Invalid role');
        setShowError(true);
      }
    }
      catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong. Please try again.');
        }
        setShowError(true);
      }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (errorRef.current && !errorRef.current.contains(e.target as Node)) {
        setShowError(false);
      }
    };
    if (showError) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showError]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center relative"
      style={{
        backgroundImage: 'url(/images/backgroundLoginPage.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80"></div>

      {/* Error Popup */}
      <AnimatePresence>
        {showError && (
          <motion.div
            ref={errorRef}
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-red-600 text-white px-8 py-6 rounded-xl shadow-2xl relative  max-w-md w-1/2"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setShowError(false)}
                className="absolute top-2 right-4 text-white text-2xl font-bold hover:text-gray-300 cursor-pointer"
              >
                &times;
              </button>
              <div className="mb-1 text-center">
  <h3 className="text-xl font-bold">{error}</h3>
</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Box */}
      <motion.div
        className="relative z-10 p-12 bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-lg shadow-xl w-full max-w-lg space-y-8 border-4 border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <motion.p
          className="text-3xl text-center text-white font-semibold italic mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          "Success is a journey, not a destination."
        </motion.p>

        <h2 className="text-5xl font-extrabold text-white tracking-tight text-center mb-6">Login</h2>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-5 rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 mb-6 bg-gray-900 text-white"
          />
        </motion.div>

        <motion.div
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
>
  <div className="relative mb-8">
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-5 pr-12 rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 bg-gray-900 text-white"
    />
    <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black cursor-pointer hover:text-yellow-400"
      onClick={() => setShowPassword((prev) => !prev)}
    />
  </div>
</motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-800 text-white font-bold text-lg transition-all duration-500 hover:scale-105 hover:from-yellow-400 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-300 cursor-pointer"
          >
            Login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
