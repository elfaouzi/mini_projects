import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserFriends, FaChartLine, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { seances } from '../../../utils/fakedata/seances';
import { Fakeusers } from '../../../utils/fakedata/users';
import OverviewCards from './OverviewCards';
import SeancesTable from './SeancesTable';
import PerformanceChart from './PerformanceChart';
import RecentActivity from './RecentActivity';

const coach = {
  name: 'Coach Alex Turner',
  specialty: 'HIIT',
  experience: 7,
  email: 'alex.turner@elysium.com',
};

const mySeances = seances.filter(s => s.coach === coach.name);
const totalMembers = Fakeusers.filter(u => u.role === 'member').length;

const Dashboard = () => (
  <motion.div
    className="max-w-5xl mx-auto p-6 mt-8 animate-fadeIn"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          <FaUserCheck /> Welcome, {coach.name}
        </h1>
        <p className="text-gray-600 text-lg">Specialty: <span className="font-semibold text-purple-700">{coach.specialty}</span> &bull; {coach.experience} years experience</p>
        <p className="text-gray-500 text-sm mt-1">Email: {coach.email}</p>
      </div>
    </div>
    <OverviewCards />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <SeancesTable  />
      <div className="flex flex-col gap-6">
        <PerformanceChart />
        <RecentActivity />
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
