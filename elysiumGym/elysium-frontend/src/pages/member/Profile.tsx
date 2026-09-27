import React from 'react';
import { motion } from 'framer-motion';
import { users } from '../../utils/fakedata/users';

const currentMember = users.find(u => u.role === 'member');

export default function Profile() {
  return (
    <motion.div
      className="max-w-xl mx-auto p-6 mt-8 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-purple-700 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-xl p-6">
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Name:</span> {currentMember?.fullName}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Email:</span> {currentMember?.email}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Phone:</span> {currentMember?.phone}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-gray-700">Subscription:</span> <span className="text-green-700 font-bold">Active</span>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition">Edit Profile</button>
      </div>
    </motion.div>
  );
}
