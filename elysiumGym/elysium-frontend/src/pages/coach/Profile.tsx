import React from 'react';
import { motion } from 'framer-motion';

const coach = {
  name: 'Coach Alex Turner',
  specialty: 'HIIT',
  experience: 7,
  email: 'alex.turner@elysium.com',
  phone: '+1 555-123-4567',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const Profile = () => (
  <motion.div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-6 mb-6">
      <img src={coach.avatar} alt="Coach Avatar" className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg" />
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{coach.name}</h1>
        <p className="text-lg text-gray-500">{coach.specialty} Coach &bull; {coach.experience} years</p>
        <p className="text-md text-gray-400 mt-1">{coach.email}</p>
        <p className="text-md text-gray-400">{coach.phone}</p>
      </div>
    </div>
    <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg shadow transition">Edit Profile</button>
  </motion.div>
);

export default Profile;
