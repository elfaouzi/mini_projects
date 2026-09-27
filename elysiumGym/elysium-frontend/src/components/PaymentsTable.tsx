import React, { useState, useMemo } from 'react';
import { payments } from './../utils/fakedata/payments';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const statusColors = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
};

export default function PaymentsTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const methods = useMemo(() => [
    ...new Set(payments.map(p => p.method))
  ], []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl p-6 w-full min-h-[80vh] relative"
      layout={false}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaMoneyBillWave /> Payments
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow outline-none text-gray-700"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="rounded-lg border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow"
          >
            <option value="all">All Methods</option>
            {methods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg relative">
        <table className="min-w-full table-fixed divide-y divide-gray-200" style={{ minHeight: `${pageSize * 64}px` }}>
          <thead className="bg-[#151d30] sticky top-0 z-10">
            <tr>
              {['User', 'Email', 'Amount', 'Date', 'Method', 'Status'].map((title, idx) => (
                <th
                  key={title}
                  className="px-6 py-3 text-center align-middle text-xs font-bold text-yellow-500 uppercase tracking-wider bg-[#111827] sticky top-0 z-10 truncate"
                  style={{ width: ["18%","22%","14%","14%","16%","16%"][idx] }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 ">
            <AnimatePresence initial={false} mode="wait">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="pt-8 text-center text-2xl font-bold text-yellow-500 animate-fadeIn">
                    <span className="block text-4xl mb-2">💸</span>
                    <span>No payments found.<br/>Try adjusting your search or filters!</span>
                  </td>
                </tr>
              ) :
              paginatedPayments.map((p, idx) => (
                <motion.tr
                  key={p.id}
                  className="hover:bg-blue-50 transition"
                  layout={false}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800 text-center align-middle">{p.user}</td>
                  <td className="px-6 py-4 text-gray-600 text-center align-middle">{p.email}</td>
                  <td className="px-6 py-4 text-blue-700 font-bold text-center align-middle">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-center align-middle">{p.date}</td>
                  <td className="px-6 py-4 text-purple-700 font-semibold text-center align-middle">{p.method}</td>
                  <td className="px-6 py-4 text-center align-middle">
                    <span className={`flex items-center justify-center gap-2 px-2 py-1 rounded text-xs font-bold ${statusColors[p.status]}`}> 
                      {p.status === 'Paid' && <FaCheckCircle className="inline" />} 
                      {p.status === 'Pending' && <FaClock className="inline" />} 
                      {p.status === 'Failed' && <FaTimesCircle className="inline" />} 
                      <span>{p.status}</span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 absolute bottom-4 right-1/2 left-1/2" style={{transform: 'translateX(50%)'}}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === i + 1 ? 'bg-blue-700 text-white' : 'bg-blue-100 hover:bg-blue-300 text-blue-800'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
