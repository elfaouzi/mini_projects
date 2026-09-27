import React from 'react';
import { payments } from '../../utils/fakedata/payments';
import { motion } from 'framer-motion';

const Payments = () => (
  <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>
    <motion.table className="w-full bg-white rounded-xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left">Member</th>
          <th className="p-3 text-left">Amount</th>
          <th className="p-3 text-left">Date</th>
          <th className="p-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, i) => (
          <motion.tr key={p.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.03 }} className="border-b last:border-none hover:bg-yellow-50">
            <td className="p-3 font-semibold text-gray-800">{p.memberName}</td>
            <td className="p-3">${p.amount}</td>
            <td className="p-3">{p.date}</td>
            <td className={`p-3 font-semibold ${p.status === 'Paid' ? 'text-green-600' : 'text-gray-400'}`}>{p.status}</td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  </div>
);

export default Payments;
