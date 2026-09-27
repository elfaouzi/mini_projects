import React from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <motion.div
      className="max-w-xl mx-auto p-6 mt-8 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow-xl p-6 space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Notifications</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-500" defaultChecked />
            Email notifications
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="accent-green-500" />
            SMS notifications
          </label>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Theme</h2>
          <select className="border rounded px-2 py-1">
            <option>Light</option>
            <option>Dark</option>
            <option>Luxury</option>
          </select>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Change Password</h2>
          <input type="password" placeholder="New password" className="border rounded px-2 py-1 w-full" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 transition">Update Password</button>
        </div>
      </div>
    </motion.div>
  );
}
