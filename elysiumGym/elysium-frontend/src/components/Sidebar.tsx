import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  UserPlus,
  DollarSign,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: Home, label: 'Dashboard' },
  { to: '/admin/manage-users', icon: Users, label: 'Manage Users' },
  { to: '/admin/add-user', icon: UserPlus, label: 'Add Adherent / Coach' },
  { to: '/admin/seances', icon: Calendar, label: 'Seances' },
  { to: '/admin/payments', icon: DollarSign, label: 'Payments' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`h-screen bg-[#111827] shadow-lg transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } p-4 flex flex-col justify-between`}
    >
      {/* Top */}
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white mb-6 flex items-center justify-between w-full   "
        >
          {!collapsed ? (
            <>
              <span className="text-2xl font-bold">Admin Panel</span>
              <ChevronLeft className="w-5 h-5 cursor-pointer hover:text-yellow-500 transition-colors" />
            </>
          ) : (
            <ChevronRight className="mx-auto w-5 h-5 cursor-pointer hover:text-yellow-500 transition-colors" />
          )}
        </button>

        <nav className="space-y-3">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                to={to}
                key={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-yellow-500 text-[#111827]'
                    : 'text-white hover:bg-yellow-500 hover:text-[#111827]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Optional Footer or Logo */}
      <div className="text-sm text-gray-400 text-center">
        {!collapsed && '© 2025 Elysium Gym '}
      </div>
    </div>
  );
};

export default Sidebar;
