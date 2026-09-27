import React from 'react';
import { motion } from 'framer-motion';

const Settings = () => (
  <motion.div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold mb-6 text-gray-900">Settings</h1>
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-yellow-400" />
        Email Notifications
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-yellow-400" />
        SMS Reminders
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" className="accent-yellow-400" />
        Dark Mode
      </label>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg shadow transition mt-4">Save Settings</button>
    </div>
  </motion.div>
);

export default Settings;
