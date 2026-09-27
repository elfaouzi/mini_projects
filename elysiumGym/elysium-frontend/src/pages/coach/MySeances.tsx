import { useState, useEffect } from 'react';
import { seances } from '../../utils/fakedata/seances';
import { motion } from 'framer-motion';
import { getCoachSeances, updateSeance } from '../../utils/api';
import { FaCalendarAlt, FaClock, FaUsers, FaEye, FaEdit, FaTrash, FaFilter, FaSpinner } from 'react-icons/fa';

// Type definition based on the new seance structure
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
  enrolledMembers?: any[];
  members?: any[]; // For fallback compatibility
}

const MySeances = () => {
  const [seanceData, setSeanceData] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Helper function to convert ISO date to YYYY-MM-DD format
  const formatDateFromISO = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch {
      return isoDate;
    }
  };

  // Fetch seances data from API with fallback to fake data
  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const response = await getCoachSeances();
        console.log('Fetched coach seances:', response);
        
        let seancesArray: Seance[] = [];
        
        // Handle the actual API response structure
        const responseData: any = response?.data || response;
        
        if (responseData && responseData.seances && Array.isArray(responseData.seances)) {
          // API returns: { seances: [...] }
          seancesArray = responseData.seances.map((s: any) => ({
            _id: s._id,
            title: s.title,
            date: formatDateFromISO(s.date), // Convert ISO date to YYYY-MM-DD
            time: s.time,
            specialty: s.specialty,
            maxMembers: s.maxMembers,
            description: s.description,
            duration: s.duration,
            status: s.status,
            enrolledMembers: s.registeredMembers || [] // Map registeredMembers to enrolledMembers
          }));
        } else {
          console.error('Invalid seances data format, using fake data:', response);
          // Convert fake data to match our interface
          seancesArray = seances.map(s => ({
            ...s,
            status: s.status === 'upcoming' ? 'active' : s.status as 'active' | 'cancelled',
            enrolledMembers: s.members || []
          }));
        }
        
        console.log('Parsed seances:', seancesArray);
        setSeanceData(seancesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seances, using fake data:', error);
        // Convert fake data to match our interface
        const convertedSeances = seances.map(s => ({
          ...s,
          status: s.status === 'upcoming' ? 'active' : s.status as 'active' | 'cancelled',
          enrolledMembers: s.members || []
        }));
        setSeanceData(convertedSeances);
        setLoading(false);
      }
    };

    fetchSeances();
  }, []);

  const specialties = Array.from(new Set(seanceData.map(s => s.specialty)));
  
  // Filter by specialty and status
  const filtered = seanceData.filter(s => {
    const matchesSpecialty = filter === 'All' || s.specialty === filter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSpecialty && matchesStatus;
  });

  // Action handlers
  const handleViewSeance = (seance: Seance) => {
    console.log('Viewing seance:', seance);
    // TODO: Implement view functionality
  };

  const handleEditSeance = (seance: Seance) => {
    console.log('Editing seance:', seance);
    // TODO: Implement edit functionality
  };

  const handleCancelSeance = async (seance: Seance) => {
    if (!confirm('Are you sure you want to cancel this seance?')) return;
    
    setActionLoading(seance._id || seance.id?.toString() || '');
    try {
      await updateSeance(seance._id || seance.id!, { status: 'cancelled' });
      
      // Update local state
      setSeanceData(prev => 
        prev.map(s => 
          (s._id || s.id) === (seance._id || seance.id) 
            ? { ...s, status: 'cancelled' as const }
            : s
        )
      );
    } catch (error) {
      console.error('Error cancelling seance:', error);
      alert('Failed to cancel seance. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaSpinner className="text-4xl text-blue-500 mx-auto mb-4 animate-spin" />
          <div className="text-xl font-semibold text-gray-600">Loading your seances...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header Section */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <FaCalendarAlt className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Seances</h1>
            <p className="text-gray-600">Manage your upcoming and past sessions</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              className="pl-10 pr-8 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Specialties</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Seances</p>
              <p className="text-3xl font-bold text-gray-900">{seanceData.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Seances</p>
              <p className="text-3xl font-bold text-gray-900">
                {seanceData.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaClock className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Spots</p>
              <p className="text-3xl font-bold text-gray-900">
                {seanceData.reduce((acc, s) => acc + s.maxMembers, 0)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUsers className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Seances Grid */}
      {filtered.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No seances found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new seance</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((seance, index) => (
            <motion.div
              key={seance._id || seance.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                <h3 className="text-lg font-bold truncate">{seance.title}</h3>
                <p className="text-blue-100 text-sm">{seance.specialty}</p>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaCalendarAlt className="text-blue-500" />
                    <span className="font-medium">{formatDate(seance.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaClock className="text-purple-500" />
                    <span className="font-medium">{formatTime(seance.time)}</span>
                    {seance.duration && (
                      <span className="text-sm text-gray-500">({seance.duration} min)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaUsers className="text-green-500" />
                    <span className="font-medium">
                      {(seance.enrolledMembers?.length || seance.members?.length || 0)} / {seance.maxMembers} spots
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(seance.status)}`}>
                      {seance.status.charAt(0).toUpperCase() + seance.status.slice(1)}
                    </span>
                  </div>
                  
                  {seance.description && seance.description !== seance.title && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{seance.description}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewSeance(seance)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                  >
                    <FaEye />
                    <span>View</span>
                  </button>
                  
                  <button
                    onClick={() => handleEditSeance(seance)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors font-medium"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  
                  {seance.status === 'active' && (
                    <button
                      onClick={() => handleCancelSeance(seance)}
                      disabled={actionLoading === (seance._id || seance.id?.toString())}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === (seance._id || seance.id?.toString()) ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySeances;
