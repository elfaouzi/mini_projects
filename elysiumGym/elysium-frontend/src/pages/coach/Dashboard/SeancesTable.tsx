import React from 'react';
import { motion } from 'framer-motion';
import { seances } from '../../../utils/fakedata/seances';

const mySeances = seances.slice(0, 5); // Replace with filter by coach if needed

const SeancesTable = () => (
  <motion.div className="bg-white rounded-xl shadow-lg p-6 col-span-2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <h2 className="text-xl font-semibold mb-4 text-gray-900">My Seances</h2>
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th className="pb-2">Title</th>
          <th className="pb-2">Date</th>
          <th className="pb-2">Time</th>
          <th className="pb-2">Specialty</th>
          <th className="pb-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {mySeances.map((s, i) => (
          <motion.tr key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="border-b last:border-none">
            <td className="py-2 font-medium">{s.title}</td>
            <td className="py-2">{s.date}</td>
            <td className="py-2">{s.time}</td>
            <td className="py-2">{s.specialty}</td>
            <td className={`py-2 font-semibold ${s.status === 'upcoming' ? 'text-green-600' : 'text-gray-400'}`}>{s.status}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

export default SeancesTable;
