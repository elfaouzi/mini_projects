import React from 'react';

const data = [
  { title: 'Total Users', value: '1,245', color: 'bg-blue-500' },
  { title: 'Active Users', value: '865', color: 'bg-green-500' },
  { title: 'Revenue', value: '$12,300', color: 'bg-yellow-500' },
  { title: 'Errors', value: '23', color: 'bg-red-500' },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, idx) => (
        <div key={idx} className={`p-6 rounded-lg shadow text-white ${item.color}`}>
          <p className="text-sm">{item.title}</p>
          <h3 className="text-2xl font-bold">{item.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;