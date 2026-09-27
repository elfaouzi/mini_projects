import React, { useState, useMemo } from 'react';
import { seances} from './../utils/fakedata/seances';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const statusColors = {
  upcoming: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function SeancesTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 4;

  // Unique specialties for filter
  const specialties = useMemo(() => [
    ...new Set(seances.map(s => s.specialty))
  ], []);

  // Filtering logic
  const filteredSeances = seances.filter(s => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.coach.toLowerCase().includes(search.toLowerCase()) ||
      s.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSpecialty = specialtyFilter === 'all' || s.specialty === specialtyFilter;
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const totalPages = Math.ceil(filteredSeances.length / pageSize);
  const paginatedSeances = filteredSeances.slice((page - 1) * pageSize, page * pageSize);

  return (
    <motion.div
      className="bg-[#ffffff] rounded-xl shadow-xl p-6 w-full min-h-[80vh] relative"
      layout={false}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <FaCalendarAlt /> Seances
        </h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search seances..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-yellow-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 transition-all shadow outline-none text-gray-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border-2 border-yellow-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 text-gray-800 shadow"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
            className="rounded-lg border-2 border-yellow-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 text-gray-800 shadow"
          >
            <option value="all">All Specialties</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg relative">
        <table className="min-w-full table-fixed divide-y divide-gray-700" style={{ minHeight: `${pageSize * 72}px` }}>
          <thead className="bg-[#111827] sticky top-0 z-10">
            <tr>
              {['Title', 'Coach', 'Specialty', 'Date', 'Time', 'Members', 'Status', 'Location'].map((title, idx) => (
                <th
                  key={title}
                  className="px-6 py-3 text-center align-middle text-xs font-bold text-yellow-400 uppercase tracking-wider bg-[#111827] sticky top-0 z-10 truncate"
                  style={{ width: ["18%","14%","12%","12%","10%","14%","10%","10%"][idx] }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <AnimatePresence initial={false} mode="wait">
              {paginatedSeances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="pt-8 text-center text-2xl font-bold text-yellow-400 animate-fadeIn">
                    <span className="block text-4xl mb-2">🗓️</span>
                    <span>No seances found.<br/>Try adjusting your search or filters!</span>
                  </td>
                </tr>
              ) :
              paginatedSeances.map((s, idx) => (
                <motion.tr
                  key={s.id}
                  className="hover:bg-[#c8d5ff67] transition"
                  layout={false}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800 truncate max-w-[180px] group relative text-center align-middle">
                    <div className="flex flex-col items-center justify-center">
                      <span>{s.title.length > 18 ? s.title.slice(0, 16) + '...' : s.title}</span>
                      <span className="text-xs text-blue-400 font-normal">ID: {s.id}</span>
                    </div>
                    {s.title.length > 18 && (
                      <div className="absolute left-1/2 top-full z-30 hidden group-hover:flex flex-col items-center w-max min-w-[180px] max-w-xs">
                        <span className="mt-2 bg-white border border-yellow-300 shadow-lg rounded-lg px-4 py-2 text-sm text-yellow-900 font-semibold whitespace-normal animate-fadeIn">
                          {s.title}
                        </span>
                        <span className="w-3 h-3 bg-white border-l border-t border-yellow-300 rotate-45 -mt-2"></span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-yellow-700 font-bold truncate max-w-[120px] text-center align-middle">{s.coach}</td>
                  <td className="px-6 py-4 text-purple-700 font-semibold truncate max-w-[100px] text-center align-middle">{s.specialty}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-center align-middle">{s.date}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-center align-middle">{s.time} <span className="text-xs text-yellow-500">({s.duration}m)</span></td>
                  <td className="px-6 py-4 text-gray-700 text-center align-middle">
                    <span className="flex items-center justify-center gap-1">
                      <FaUserFriends className="text-yellow-500" />
                      {s.members.length} / {s.maxMembers}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <span className={`flex items-center justify-center gap-2 px-2 py-1 rounded text-xs font-bold ${statusColors[s.status]}`}> 
                      {s.status === 'upcoming' && <FaClock className="inline" />} 
                      {s.status === 'completed' && <FaCheckCircle className="inline" />} 
                      {s.status === 'cancelled' && <FaTimesCircle className="inline" />} 
                      <span>{s.status.charAt(0).toUpperCase() + s.status.slice(1)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-700 font-semibold truncate max-w-[100px] flex items-center justify-center gap-1 text-center align-middle">
                    <FaMapMarkerAlt /> {s.location}
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
            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-[#151d30]'}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === i + 1 ? 'bg-yellow-500 text-[#151d30]' : 'bg-yellow-100 hover:bg-yellow-300 text-yellow-800'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-[#151d30]'}`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
