import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sun, ChevronDown, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearUserInfo } from '../app/store/userSlice';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate('/login'); // Adjust the route based on your setup
  };

  return (
    <div className="bg-[#fdf9ef] shadow px-6 py-4 flex justify-between items-center relative">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      <div className="flex items-center space-x-6">
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-2 border rounded-lg focus:outline-none focus:ring w-64"
        />

        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </div>

        <button className="text-gray-600 hover:text-yellow-500 transition">
          <Sun className="w-6 h-6" />
        </button>

        {/* Avatar and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50 transform transition-all duration-300 ease-out ${
              dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer hover:rounded-md"
            >
              <LogOut className="w-5 h-5 mr-2 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
