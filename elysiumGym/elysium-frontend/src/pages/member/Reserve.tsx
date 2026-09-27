import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { seances } from '../../utils/fakedata/seances';
import { getAvailableSeances, reserveSeance } from '../../utils/api';
import { FaCrown, FaUserTie, FaDumbbell, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import type { RootState } from '../../app/store/store';

// Define seance interface based on API structure
interface Seance {
  _id?: string;
  id?: string | number;
  title: string;
  date: string;
  time: string;
  specialty: string;
  maxMembers: number;
  description?: string;
  duration?: number;
  status: 'active' | 'cancelled';
  coach: {
    _id?: string;
    name: string;
    email?: string;
  } | string; // For backward compatibility
  registeredMembers?: any[];
  enrolledMembers?: any[];
  members?: any[]; // For fallback compatibility
}

export default function Reserve() {
  const [seancesData, setSeancesData] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Seance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Get user info from Redux store
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  // Fetch available seances from API
  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const response = await getAvailableSeances();
        console.log('Fetched available seances:', response);
        
        let seancesArray: Seance[] = [];
        
        // Handle the API response structure
        const responseData: any = response?.data || response;
        
        if (responseData && responseData.seances && Array.isArray(responseData.seances)) {
          seancesArray = responseData.seances.map((s: any) => ({
            _id: s._id,
            title: s.title,
            date: formatDateFromISO(s.date),
            time: s.time,
            specialty: s.specialty,
            maxMembers: s.maxMembers,
            description: s.description,
            duration: s.duration,
            status: s.status,
            coach: s.coach, // This could be an object or string
            registeredMembers: s.registeredMembers || [],
            enrolledMembers: s.enrolledMembers || []
          }));
        } else {
          console.error('Invalid seances data format, using fake data:', response);
          // Convert fake data to match our interface
          seancesArray = seances.filter(s => s.status === 'upcoming').map(s => ({
            ...s,
            status: 'active' as const,
            coach: s.coach, // Keep original coach structure
            registeredMembers: s.members || []
          }));
        }
        
        setSeancesData(seancesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seances, using fake data:', error);
        // Convert fake data to match our interface
        const convertedSeances = seances.filter(s => s.status === 'upcoming').map(s => ({
          ...s,
          status: 'active' as const,
          coach: s.coach, // Keep original coach structure
          registeredMembers: s.members || []
        }));
        setSeancesData(convertedSeances);
        setLoading(false);
      }
    };

    fetchSeances();
  }, []);

  // Helper function to convert ISO date to YYYY-MM-DD format
  const formatDateFromISO = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toISOString().split('T')[0];
    } catch {
      return isoDate;
    }
  };

  // Filter seances based on search term
  const filteredSeances = seancesData.filter(seance => {
    const searchLower = searchTerm.toLowerCase();
    
    return (
      seance.title.toLowerCase().includes(searchLower) ||
      seance.specialty.toLowerCase().includes(searchLower)
    );
  });

  // Calculate available spots for a seance
  const getAvailableSpots = (seance: Seance) => {
    const registeredCount = seance.registeredMembers?.length || seance.enrolledMembers?.length || 0;
    return seance.maxMembers - registeredCount;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeStr;
    }
  };

  const handleReserve = (seance: Seance) => {
    setSelected(seance);
    setShowModal(true);
    setError(''); // Clear any previous errors
  };

  const confirmReserve = async () => {
    if (!selected || !userInfo) {
      setError('User not authenticated');
      return;
    }

    setReserving(true);
    try {
      console.log('Reserving seance:', selected._id || selected.id);
      
      // Call the API to reserve the seance
      const response = await reserveSeance(selected._id || selected.id!,userInfo.id);
      console.log('Reservation successful:', response);
      
      // Update local state to reflect the reservation
      setSeancesData(prev =>
        prev.map(s =>
          (s._id || s.id) === (selected._id || selected.id)
            ? {
                ...s,
                registeredMembers: [
                  ...(s.registeredMembers || []),
                  { _id: userInfo._id, name: userInfo.name, email: userInfo.email }
                ]
              }
            : s
        )
      );
      
      setShowModal(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error reserving seance:', error);
      
      // Handle different types of errors
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError('Failed to reserve seance. Please try again.');
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 mt-10 flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaSpinner className="text-4xl text-yellow-500 mx-auto mb-4 animate-spin" />
          <div className="text-xl font-semibold text-yellow-300">Loading available seances...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 mt-10 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-8 flex items-center gap-3 drop-shadow-lg">
        <FaCrown className="text-2xl text-yellow-500" /> Reserve a Seance
      </h1>
      <div className="bg-gradient-to-br from-[#232526] to-[#ffd700]/10 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <span className="text-lg font-semibold text-yellow-300">Available Seances</span>
          <input
            type="text"
            placeholder="Search by title or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-400 bg-[#18181b] text-yellow-100 placeholder-yellow-200 w-full md:w-80"
          />
        </div>
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full divide-y divide-yellow-100 table-auto overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Title</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Specialty</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Spots Left</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-yellow-500 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSeances.map((s) => (
                <motion.tr
                  key={s._id || s.id}
                  className="hover:bg-yellow-50/30 transition cursor-pointer group"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="px-4 py-3 font-semibold text-yellow-100 whitespace-nowrap">{s.title}</td>
                  <td className="px-4 py-3 text-yellow-200 font-mono whitespace-nowrap">{formatDate(s.date)}</td>
                  <td className="px-4 py-3 text-yellow-200 font-mono whitespace-nowrap">{formatTime(s.time)}</td>
                 
                  <td className="px-4 py-3 text-yellow-400 font-bold whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <FaDumbbell />
                      {s.specialty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-yellow-200 font-semibold text-center whitespace-nowrap">
                    {getAvailableSpots(s)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-[#18181b] font-bold px-5 py-2 rounded-xl shadow-lg transition-all duration-200 group-hover:scale-105"
                      onClick={() => handleReserve(s)}
                    >
                      Reserve
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Reserve Modal */}
      <AnimatePresence>
        {showModal && selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-yellow-600 mb-4">Confirm Reservation</h2>
              <div className="mb-4">
                <div className="font-semibold text-lg text-gray-800">{selected.title}</div>
                <div className="text-gray-500">{selected.date} at {selected.time}</div>
                <div className="text-yellow-500">Specialty: {selected.specialty}</div>
              </div>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg mr-2"
                onClick={confirmReserve}
              >
                Confirm
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold shadow ml-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Success Feedback */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 bg-yellow-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <FaCheckCircle className="text-2xl" /> Reservation successful!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
