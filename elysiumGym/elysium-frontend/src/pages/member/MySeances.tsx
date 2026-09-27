import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getMemberSeancesReserved, cancelReservation } from '../../utils/api';

interface Seance {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  specialty: string;
  maxMembers: number;
  registeredCount: number;
  availableSpots: number;
  status: 'active' | 'cancelled' | 'completed';
  reservationStatus: 'confirmed' | 'pending' | 'cancelled';
  coach?: {
    _id: string;
    name: string;
    email: string;
  };
  registeredMembers?: {
    _id: string;
    name: string;
    email: string;
  }[];
  createdAt: string;
}

export default function MySeancesReserved() {
  const [mySeances, setMySeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const user = useSelector((state: any) => state.user.userInfo);

  useEffect(() => {
    const fetchMySeances = async () => {
      if (!user?.id) {
        setError('User not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMemberSeancesReserved(user.id);
        console.log('Fetched member seances:', response);
        // Explicitly type response.data to avoid TS error
        const data = response.data as { seances?: Seance[] };
        setMySeances(Array.isArray(data.seances) ? data.seances : []);
      } catch (err: any) {
        console.error('Error fetching member seances:', err);
        setError(err.message || 'Failed to fetch your seances');
      } finally {
        setLoading(false);
      }
    };

    fetchMySeances();
  }, [user?.id]);

  const handleCancelReservation = async (seanceId: string) => {
    try {
      // TODO: Implement cancel reservation API call
      console.log('Canceling reservation for seance:', seanceId);
      // Remove from local state for now
      setMySeances(prev => prev.filter(s => s._id !== seanceId));
    } catch (err: any) {
      console.error('Error canceling reservation:', err);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="max-w-4xl mx-auto p-6 mt-8 animate-fadeIn"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-green-700 mb-6">My Seances</h1>
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your seances...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="max-w-4xl mx-auto p-6 mt-8 animate-fadeIn"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-green-700 mb-6">My Seances</h1>
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 mt-8 animate-fadeIn"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">My Seances</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="bg-green-100 px-3 py-1 rounded-full">
            Total: {mySeances.length}
          </span>
          <span className="bg-blue-100 px-3 py-1 rounded-full">
            Confirmed: {mySeances.filter(s => s.reservationStatus === 'confirmed').length}
          </span>
          <span className="bg-yellow-100 px-3 py-1 rounded-full">
            Pending: {mySeances.filter(s => s.reservationStatus === 'pending').length}
          </span>
          <span className="bg-purple-100 px-3 py-1 rounded-full">
            Active: {mySeances.filter(s => s.status === 'active').length}
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {mySeances.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0h8m-8 0v9a2 2 0 002 2h4a2 2 0 002-2V7" />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold">No seances reserved yet</p>
            <p className="text-gray-500 mt-2">Visit the Reserve page to book your first seance!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seance Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coach & Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mySeances.map((seance) => (
                  <motion.tr
                    key={seance._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{seance.title}</div>
                        {seance.description && (
                          <div className="text-sm text-gray-500 mt-1 max-w-xs">
                            {seance.description.length > 80 
                              ? `${seance.description.substring(0, 80)}...` 
                              : seance.description}
                          </div>
                        )}
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          Duration: {seance.duration} min
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(seance.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-green-600 font-medium">{seance.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {seance.coach ? (
                          <div className="text-sm font-medium text-gray-900">{seance.coach.name}</div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No coach assigned</div>
                        )}
                        <div className="text-xs text-purple-600 mt-1 bg-purple-50 px-2 py-1 rounded-full inline-block">
                          {seance.specialty}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900 font-medium">
                          {seance.registeredCount || 0}/{seance.maxMembers}
                        </div>
                        <div className={`text-xs mt-1 ${
                          seance.availableSpots > 5 ? 'text-green-600' : 
                          seance.availableSpots > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {seance.availableSpots} spots left
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          seance.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : seance.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {seance.status}
                        </span>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            seance.reservationStatus === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : seance.reservationStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {seance.reservationStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {seance.status === 'active' && seance.reservationStatus === 'confirmed' && (
                        <button
                          onClick={() => handleCancelReservation(seance._id)}
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
