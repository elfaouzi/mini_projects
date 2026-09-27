import React from 'react';
import { motion } from 'framer-motion';
import { payments } from '../../utils/fakedata/payments';
import { users } from '../../utils/fakedata/users';

const currentMember = users.find(u => u.role === 'member');
const myPayments = payments.filter(p => p.user === currentMember?.fullName);

export default function Payments() {
  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 mt-8 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-blue-700 mb-6">My Payments</h1>
      <div className="bg-white rounded-xl shadow-xl p-6">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-blue-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-blue-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-blue-500 uppercase tracking-wider">Method</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-blue-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-blue-500 uppercase tracking-wider">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {myPayments.map(p => (
              <tr key={p.id} className="hover:bg-blue-50 transition">
                <td className="px-4 py-2 text-gray-700 font-mono">{p.date}</td>
                <td className="px-4 py-2 text-green-700 font-bold">${p.amount}</td>
                <td className="px-4 py-2 text-gray-700">{p.method}</td>
                <td className="px-4 py-2 text-blue-700 font-semibold capitalize">{p.status}</td>
                <td className="px-4 py-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
