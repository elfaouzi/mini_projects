import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { Fakeusers } from './../utils/fakedata/users';
import { FaSpinner } from 'react-icons/fa'; // Spinner icon
import EditUserForm from './EditUserForm';
import { getUsers } from '../utils/api';


type User = {
  id: number;
  fullName: string;
  email: string;
  role: 'member' | 'coach';
  phone: string;
  subscription?: string;
  subscriptionStart?: string;
  specialty?: string;
  experience?: number;
};


export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  // Spinner and middle state logic
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [middleState, setMiddleState] = useState<User[] | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log('Fetched users:', response);
      
      let userData = [];
      if (response && Array.isArray(response)) {
        userData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        userData = response.data;
      } else {
        console.error('Invalid user data format, using fake data:', response);
        userData = Fakeusers.map((u) => ({ ...u, role: u.role as 'member' | 'coach' }));
      }
      
      setUsers(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users, using fake data:', error);
      setUsers(Fakeusers.map((u) => ({ ...u, role: u.role as 'member' | 'coach' })));
      setIsLoading(false);
    }
  }
  
  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update pendingUsers when pagination changes or when users data is loaded
  useEffect(() => {
    if (users.length > 0) {
      setIsAnimating(true);
      setMiddleState(pendingUsers); // Save current rows as middle state
      
      const timer = setTimeout(() => {
        setPendingUsers(paginatedUsers);
        setIsAnimating(false);
        setMiddleState(null);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [page, search, roleFilter, subscriptionFilter, users.length]);

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    let matchesSubscription = true;
    if (roleFilter === 'member') {
      matchesSubscription =
        subscriptionFilter === 'all' ||
        (user.role === 'member' && user.subscription === subscriptionFilter);
    } else if (roleFilter === 'coach') {
      matchesSubscription =
        subscriptionFilter === 'all' ||
        (user.role === 'coach' && user.specialty === subscriptionFilter);
    }
    // For 'all', matchesSubscription is always true

    return matchesSearch && matchesRole && matchesSubscription;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [search, roleFilter, subscriptionFilter]);

  // Handle loading and animation transitions
  useEffect(() => {
    // Initial load of first page when users data is available
    if (users.length > 0 && pendingUsers.length === 0) {
      setPendingUsers(paginatedUsers);
    }
  }, [users, paginatedUsers]);

  // Table minHeight for consistent size
  const minRows = pageSize;
  const emptyRows = Math.max(0, minRows - (middleState ? middleState.length : pendingUsers.length));
const rowHeight = 64; // height in px, matching your styling

  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl p-6 w-full min-h-[80vh] relative"
      layout={false} // Prevent parent layout animation
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Users List</h2>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow outline-none text-gray-700"
            />
          </div>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={e => {
              setRoleFilter(e.target.value);
              setSubscriptionFilter('all'); // Reset second filter when role changes
            }}
            className="rounded-lg border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow"
          >
            <option value="all">All Roles</option>
            <option value="member">Member</option>
            <option value="coach">Coach</option>
          </select>
          {/* Dependent Filter */}
          {roleFilter === 'member' && (
            <select
              value={subscriptionFilter}
              onChange={e => setSubscriptionFilter(e.target.value)}
              className="rounded-lg border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow"
            >
              <option value="all">All Types</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
          {roleFilter === 'coach' && (
            <select
              value={subscriptionFilter}
              onChange={e => setSubscriptionFilter(e.target.value)}
              className="rounded-lg border-2 border-blue-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow"
            >
              <option value="all">All Specialties</option>
              {/* Dynamically get unique specialties from users */}
              {[...new Set(users.filter(u => u.role === 'coach' && u.specialty).map(u => u.specialty))].map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          )}
          {roleFilter === 'all' && (
            <select
              disabled
              className="rounded-lg border-2 border-blue-200 px-3 py-2 bg-gray-100 text-gray-400 shadow"
            >
              <option>Choose a role first</option>
            </select>
          )}
        </div>
      </div>
      <div className="rounded-lg relative">
        {(isLoading || isAnimating) && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/80">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="text-blue-500 text-6xl"
            >
              <FaSpinner />
            </motion.div>
          </div>
        )}
<table
  className="min-w-full table-fixed divide-y divide-gray-200"
  style={{ minHeight: `${pageSize * rowHeight}px` }}
>          <thead className="bg-[#151d30] sticky top-0 z-10">
            <tr>
              {['Name', 'Email', 'Role', 'Phone', 'Details', 'Actions'].map((title, idx) => (
                <th
                  key={title}
                  className="px-6 py-3 text-left text-xs font-bold text-yellow-500 uppercase tracking-wider bg-[#111827] sticky top-0 z-10 truncate"
                  style={{ width: ["18%","18%","10%","16%","24%","14%"][idx] }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 ">
            <AnimatePresence initial={false} mode="wait">
                {(middleState || pendingUsers).length === 0 ? (
                <tr>
                  <td colSpan={6} className="pt-8 text-center text-2xl font-bold text-yellow-500  animate-fadeIn">
                    <span className="block text-4xl mb-2">😕</span>
                    <span>No users found.<br/>Try adjusting your search or filters!</span>
                  </td>
                </tr>
              ) :
              (middleState || pendingUsers).map((user, idx) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-blue-50 transition"
                  layout={false}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800 truncate max-w-[180px] group relative">
                    <div className="flex flex-col">
                      <span>{user.fullName.length > 18 ? user.fullName.slice(0, 16) + '...' : user.fullName}</span>
                      <span className="text-xs text-blue-400 font-normal">ID: {user.id}</span>
                    </div>
                    {user.fullName.length > 18 && (
                      <div className="absolute left-1/2 top-full z-30 hidden group-hover:flex flex-col items-center w-max min-w-[180px] max-w-xs">
                        <span className="mt-2 bg-white border border-blue-300 shadow-lg rounded-lg px-4 py-2 text-sm text-blue-900 font-semibold whitespace-normal animate-fadeIn">
                          {user.fullName}
                        </span>
                        <span className="w-3 h-3 bg-white border-l border-t border-blue-300 rotate-45 -mt-2"></span>
                      </div>
                    )}
                  </td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-[180px] group relative">
                  <span
                    className={user.email.length > 20 ? "cursor-pointer" : undefined}
                  >
                    {user.email.length > 20 ? user.email.slice(0, 18) + '...' : user.email}
                  </span>
                  {user.email.length > 20 && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 group-hover:flex hidden flex-col items-center w-max min-w-[180px] max-w-xs">
                      <span className="bg-white border border-blue-300 shadow-lg rounded-lg px-4 py-2 text-sm text-blue-900 font-semibold whitespace-normal animate-fadeIn">
                        {user.email}
                      </span>
                      <span className="w-3 h-3 bg-white border-l border-t border-blue-300 rotate-45 -mt-2"></span>
                    </div>
                  )}
                </td>
                  <td className="px-6 py-4 capitalize font-bold text-blue-600 truncate max-w-[80px] group relative">
                    <span>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-[120px] group relative">
                    <span>{user.phone.length > 14 ? user.phone.slice(0, 12) + '...' : user.phone}</span>
                    {user.phone.length > 14 && (
                      <div className="absolute left-1/2 top-full z-30 hidden group-hover:flex flex-col items-center w-max min-w-[120px] max-w-xs">
                        <span className="mt-2 bg-white border border-blue-300 shadow-lg rounded-lg px-4 py-2 text-sm text-blue-900 font-semibold whitespace-normal animate-fadeIn">
                          {user.phone}
                        </span>
                        <span className="w-3 h-3 bg-white border-l border-t border-blue-300 rotate-45 -mt-2"></span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 truncate max-w-[220px] group relative">
                    {user.role === 'member' ? (
                      <div className="flex flex-col gap-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold truncate  group-hover:max-w-none">
                          Subscription: {user.subscription && user.subscription.length > 10 ? user.subscription.slice(0, 10) + '...' : user.subscription}
                          {user.subscription && user.subscription.length > 10 && (
                            <div className="absolute left-1/2 top-full z-30 hidden group-hover:flex flex-col items-center w-max min-w-[120px] max-w-xs">
                              <span className="mt-2 bg-white border border-blue-300 shadow-lg rounded-lg px-4 py-2 text-sm text-blue-900 font-semibold whitespace-normal animate-fadeIn">
                                {user.subscription}
                              </span>
                              <span className="w-3 h-3 bg-white border-l border-t border-blue-300 rotate-45 -mt-2"></span>
                            </div>
                          )}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold truncate  group-hover:max-w-none">
                          Start: {user.subscriptionStart}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold truncate  group-hover:max-w-none">
                          Specialty: {user.specialty && user.specialty.length > 10 ? user.specialty.slice(0, 10) + '...' : user.specialty}
                          {user.specialty && user.specialty.length > 10 && (
                            <div className="absolute left-1/2 top-full z-30 hidden group-hover:flex flex-col items-center w-max min-w-[120px] max-w-xs">
                              <span className="mt-2 bg-white border border-blue-300 shadow-lg rounded-lg px-4 py-2 text-sm text-blue-900 font-semibold whitespace-normal animate-fadeIn">
                                {user.specialty}
                              </span>
                              <span className="w-3 h-3 bg-white border-l border-t border-blue-300 rotate-45 -mt-2"></span>
                            </div>
                          )}
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold truncate  group-hover:max-w-none transition-all duration-1000 group-hover:duration-1000">
                          Experience: {user.experience} yrs
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow"
                      onClick={() => setEditingUser(user)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow">
                      <FaTrash /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
              {Array.from({ length: emptyRows }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="h-16">
                  <td colSpan={6}></td>
                </tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages >  0 && (
        <div className="flex justify-center items-center gap-2 absolute bottom-4 right-1/2 left-1/2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={` cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
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
            className={` cursor-pointer px-3 py-1 rounded-lg font-semibold shadow-md text-sm ${page === totalPages ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <EditUserForm
            user={editingUser}
            onClose={() => setEditingUser(null)}
            users={users}
            setUsers={setUsers}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
