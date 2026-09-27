import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCog, FaPalette, FaBell, FaLock, FaSave } from 'react-icons/fa';

export default function Settings() {
  // Example settings state
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@elysium.com',
  });
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 mt-8 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <FaUserCog /> Settings
      </h2>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaUserCog /> Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
        </div>
        {/* Theme Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaPalette /> Theme</h3>
          <select value={theme} onChange={e => setTheme(e.target.value)} className="rounded-lg border-2 border-yellow-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 text-gray-700 shadow">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        {/* Notifications Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaBell /> Notifications</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="accent-blue-500 w-5 h-5" />
            <span className="text-gray-700 font-medium">Enable email notifications</span>
          </label>
        </div>
        {/* Password Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaLock /> Change Password</h3>
          <input type="password" className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <motion.button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.97 }}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </form>
    </motion.div>
  );
}
