// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import OverviewCards from './OverviewCards';
import ChartSection from './ChartSection';
import RecentUsers from './RecentUsers';
import { subscriptions } from '../../../utils/fakedata/subscriptions';
import { Fakeusers } from '../../../utils/fakedata/users';
import { payments } from '../../../utils/fakedata/payments';
import { seances } from '../../../utils/fakedata/seances';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FaUserClock, FaUserCheck, FaMoneyBillWave, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const COLORS = ['#2563eb', '#facc15', '#22c55e', '#f87171'];

function getExpiringSubscriptions() {
  const today = new Date();
  return subscriptions.filter(sub => {
    const start = new Date(sub.start);
    let end;
    if (sub.type === 'monthly') {
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
    } else {
      end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
    }
    // Show if expiring in next 7 days
    const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });
}

export default function Dashboard() {
  const expiring = getExpiringSubscriptions();
  const totalMembers = Fakeusers.filter(u => u.role === 'member').length;
  const totalCoaches = Fakeusers.filter(u => u.role === 'coach').length;
  const totalSeances = seances.length;
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  // Pie chart for user roles
  const userPieData = [
    { name: 'Members', value: totalMembers },
    { name: 'Coaches', value: totalCoaches },
  ];

  // Bar chart for payments by month
  const paymentBarData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (5 - i));
    const label = month.toLocaleString('default', { month: 'short' });
    const paid = payments.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear() && p.status === 'Paid';
    }).reduce((sum, p) => sum + p.amount, 0);
    return { month: label, revenue: paid };
  });

  return (
    <motion.main
      className="mt-4 p-4 max-w-7xl mx-auto animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-lg shadow text-white bg-blue-500 flex flex-col items-center justify-center">
          <FaUserCheck className="text-3xl mb-2" />
          <p className="text-sm">Total Members</p>
          <h3 className="text-2xl font-bold">{totalMembers}</h3>
        </div>
        <div className="p-6 rounded-lg shadow text-white bg-yellow-500 flex flex-col items-center justify-center">
          <FaCalendarAlt className="text-3xl mb-2" />
          <p className="text-sm">Total Seances</p>
          <h3 className="text-2xl font-bold">{totalSeances}</h3>
        </div>
        <div className="p-6 rounded-lg shadow text-white bg-green-500 flex flex-col items-center justify-center">
          <FaMoneyBillWave className="text-3xl mb-2" />
          <p className="text-sm">Total Revenue</p>
          <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="p-6 rounded-lg shadow text-white bg-purple-500 flex flex-col items-center justify-center">
          <FaUserClock className="text-3xl mb-2" />
          <p className="text-sm">Expiring Subs (7d)</p>
          <h3 className="text-2xl font-bold">{expiring.length}</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">User Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={userPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {userPieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={paymentBarData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2"><FaUserClock /> Expiring Subscriptions (Next 7 Days)</h3>
        {expiring.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No subscriptions expiring soon.</div>
        ) : (
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider">Start</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider">Expires</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expiring.map(sub => {
                const start = new Date(sub.start);
                let end;
                if (sub.type === 'monthly') {
                  end = new Date(start);
                  end.setMonth(end.getMonth() + 1);
                } else {
                  end = new Date(start);
                  end.setFullYear(end.getFullYear() + 1);
                }
                return (
                  <tr key={sub.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2 font-semibold text-gray-800">{sub.user}</td>
                    <td className="px-4 py-2 text-gray-600">{sub.email}</td>
                    <td className="px-4 py-2 text-gray-700 font-mono">{sub.start}</td>
                    <td className="px-4 py-2 text-blue-700 font-bold capitalize">{sub.type}</td>
                    <td className="px-4 py-2 text-yellow-700 font-semibold">{end.toISOString().split('T')[0]}</td>
                    <td className="px-4 py-2">
                      <a href="/admin/manage-users" className="text-blue-600 hover:underline flex items-center gap-1"><FaArrowRight /> View</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
    </motion.main>
  );
}