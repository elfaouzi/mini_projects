import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome, admin! Here you can manage the IAV school inventory.</p>
        {/* Add dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
