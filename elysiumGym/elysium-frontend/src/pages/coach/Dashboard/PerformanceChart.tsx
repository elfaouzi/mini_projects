import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', attendance: 18 },
  { day: 'Tue', attendance: 22 },
  { day: 'Wed', attendance: 15 },
  { day: 'Thu', attendance: 25 },
  { day: 'Fri', attendance: 20 },
  { day: 'Sat', attendance: 28 },
  { day: 'Sun', attendance: 19 },
];

const PerformanceChart = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Performance Overview</h2>
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <XAxis dataKey="day" stroke="#888" />
        <YAxis hide />
        <Tooltip />
        <Bar dataKey="attendance" fill="#FFD700" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default PerformanceChart;
