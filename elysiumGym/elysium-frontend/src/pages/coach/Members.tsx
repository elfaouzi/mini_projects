import React from 'react';
import { Fakeusers } from '../../utils/fakedata/users';
import { motion } from 'framer-motion';

const members = Fakeusers.filter(u => u.role === 'member');

const Members = () => (
  <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Members</h1>
    <motion.table className="w-full bg-white rounded-xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <thead className="bg-gray-50">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Phone</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m, i) => (
          <motion.tr key={m.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.03 }} className="border-b last:border-none hover:bg-yellow-50">
            <td className="p-3 font-semibold text-gray-800">{m.fullName}</td>
            <td className="p-3">{m.email}</td>
            <td className="p-3">{m.phone}</td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  </div>
);

export default Members;
