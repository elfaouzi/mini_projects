import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FaCrown, FaUser, FaBolt, FaMoneyBillWave, FaCalendarAlt, FaClipboardList, FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import { seances } from '../../../utils/fakedata/seances';
import { users } from '../../../utils/fakedata/users';
import { payments } from '../../../utils/fakedata/payments';

const member = {
  name: 'John Doe',
  email: 'john.doe@elysium.com',
  subscription: 'monthly',
  subscriptionStart: '2025-05-01',
};

const mySeances = seances.filter(s => s.members.includes(member.name));
const myPayments = payments.filter(p => p.user === member.name);

// Fix attendance calculation for status 'completed'
const attendanceCount = mySeances.filter(s => s.status === 'completed').length;
const attendancePercent = `${Math.round((attendanceCount / (mySeances.length || 1)) * 100)}%`;

// Fake stats for luxury dashboard
const overviewCards = [
  {
    label: 'Subscription',
    value: 'Platinum',
    icon: <FaCrown className="text-3xl text-yellow-400" />, 
    color: 'from-yellow-400 to-yellow-600',
    badge: 'Active',
  },
  {
    label: 'Next Seance',
    value: mySeances.find(s => s.status === 'upcoming')?.date || 'N/A',
    icon: <FaCalendarAlt className="text-3xl text-blue-400" />, 
    color: 'from-blue-400 to-blue-600',
    badge: mySeances.find(s => s.status === 'upcoming')?.title || 'No upcoming',
  },
  {
    label: 'Attendance',
    value: attendancePercent,
    icon: <FaBolt className="text-3xl text-green-400" />, 
    color: 'from-green-400 to-green-600',
    badge: `${attendanceCount} attended`,
  },
  {
    label: 'Payments',
    value: `$${myPayments.reduce((acc, p) => acc + p.amount, 0)}`,
    icon: <FaMoneyBillWave className="text-3xl text-emerald-400" />, 
    color: 'from-emerald-400 to-emerald-600',
    badge: myPayments[0]?.status || 'N/A',
  },
];

const progressData = [
  { name: 'Jan', value: 78 },
  { name: 'Feb', value: 80 },
  { name: 'Mar', value: 82 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 87 },
];

const activityTimeline = [
  { type: 'seance', label: 'Attended HIIT Seance', date: '2025-05-18' },
  { type: 'payment', label: 'Paid $50 for May', date: '2025-05-01' },
  { type: 'seance', label: 'Reserved Yoga Seance', date: '2025-04-28' },
  { type: 'profile', label: 'Updated Profile', date: '2025-04-20' },
];

export default function MemberDashboard() {
  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 mt-10 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Luxury Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {overviewCards.map(card => (
          <motion.div
            key={card.label}
            className={`bg-gradient-to-br ${card.color} rounded-3xl shadow-xl p-6 flex flex-col items-center text-center relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-3 right-3 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">{card.badge}</div>
            {card.icon}
            <div className="mt-3 text-lg font-semibold text-white drop-shadow">{card.label}</div>
            <div className="text-3xl font-extrabold text-white drop-shadow-lg mt-1">{card.value}</div>
          </motion.div>
        ))}
      </div>
      {/* Quick Links */}
      <div className="flex flex-wrap gap-4 mb-10">
        <a href="/member/reserve" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#18181b] font-bold px-5 py-3 rounded-2xl shadow-lg transition-all duration-200">
          <FaClipboardList /> Reserve Seance <FaArrowRight />
        </a>
        <a href="/member/payments" className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-[#18181b] font-bold px-5 py-3 rounded-2xl shadow-lg transition-all duration-200">
          <FaMoneyBillWave /> Payments <FaArrowRight />
        </a>
        <a href="/member/profile" className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-[#18181b] font-bold px-5 py-3 rounded-2xl shadow-lg transition-all duration-200">
          <FaUser /> Edit Profile <FaArrowRight />
        </a>
      </div>
      {/* Progress Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
        <h2 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2"><FaHeartbeat /> Health & Progress</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={progressData}>
            <XAxis dataKey="name" stroke="#bfae32" fontSize={12} />
            <YAxis stroke="#bfae32" fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#facc15" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
        <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaClipboardList /> Recent Activity</h2>
        <ul className="space-y-4">
          {activityTimeline.map((item, idx) => (
            <li key={idx} className="flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="ml-auto text-xs text-gray-400">{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* My Seances Table */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaCalendarAlt /> My Seances</h2>
        {mySeances.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No upcoming seances.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full table-auto divide-y divide-yellow-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Coach</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {mySeances.map(s => (
                  <tr key={s.id} className="hover:bg-yellow-50/30 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{s.title}</td>
                    <td className="px-4 py-3 text-blue-700 font-bold whitespace-nowrap">{s.coach}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono whitespace-nowrap">{s.time}</td>
                    <td className="px-4 py-3 text-yellow-700 font-semibold capitalize whitespace-nowrap">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
