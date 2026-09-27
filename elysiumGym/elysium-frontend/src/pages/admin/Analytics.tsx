import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getDashboardCharts } from '../../utils/api';

const revenueDataFake= [
  { month: 'Jan', revenue: 3200 },
  { month: 'Feb', revenue: 4100 },
  { month: 'Mar', revenue: 3900 },
  { month: 'Apr', revenue: 5200 },
  { month: 'May', revenue: 4800 },
  { month: 'Jun', revenue: 6100 },
];

const userPieDataFake = [
  { name: 'Members', value: 1200 },
  { name: 'Coaches', value: 80 },
];

const COLORS = ['#2563eb', '#facc15'];

type DashboardChartsResponse = {
  revenueData
: { month: string; revenue: number }[];
  userPieData?: { name: string; value: number }[];
};

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState(revenueDataFake);
  const [userPieData, setUserPieData] = useState(userPieDataFake);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardCharts();
      
      // Extract data from axios response
      const data = response.data as DashboardChartsResponse;
      console.log('Analytics data:', data);
      
      if (data && data.revenueData
) {
        setRevenueData(data.revenueData
);
        
        if (data.userPieData) {
          setUserPieData(data.userPieData);
        } else {
          // Keep fake data if userDistribution is not available
          setUserPieData(userPieDataFake);
        }
      } else {
        // Fallback to fake data if response is invalid
        setRevenueData(revenueDataFake);
        setUserPieData(userPieDataFake);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to fake data on error
      setRevenueData(revenueDataFake);
      setUserPieData(userPieDataFake);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-blue-700 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#ffffff]">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={260} >
              <BarChart data={revenueData}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">User Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={userPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {userPieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
