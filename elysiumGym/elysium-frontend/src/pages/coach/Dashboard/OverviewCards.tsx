import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaDollarSign, FaStar } from 'react-icons/fa';

const cards = [
  { label: 'Upcoming Seances', value: 8, icon: <FaCalendarAlt />, color: 'from-yellow-400 to-yellow-200' },
  { label: 'Total Members', value: 120, icon: <FaUsers />, color: 'from-blue-400 to-blue-200' },
  { label: 'Earnings', value: '$7,200', icon: <FaDollarSign />, color: 'from-green-400 to-green-200' },
  { label: 'Performance', value: '96%', icon: <FaStar />, color: 'from-purple-400 to-purple-200' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

const OverviewCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
    {cards.map((card, i) => (
      <motion.div
        key={card.label}
        className={`bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-6 flex flex-col items-start`}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className="text-3xl mb-2 text-gray-800">{card.icon}</div>
        <div className="text-2xl font-bold text-gray-900">{card.value}</div>
        <div className="text-md text-gray-700 mt-1">{card.label}</div>
      </motion.div>
    ))}
  </div>
);

export default OverviewCards;
