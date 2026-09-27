import React from 'react';

const users = [
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Maria Garcia', email: 'maria@example.com' },
  { name: 'David Johnson', email: 'david@example.com' },
];

const RecentUsers = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
      <ul className="space-y-4">
        {users.map((user, idx) => (
          <li key={idx} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button className="text-sm text-yellow-500 hover:underline">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUsers;