import React from 'react';
import { faker } from '@faker-js/faker';

const recentMembers = Array.from({ length: 5 }, () => ({
  name: faker.person.fullName(),
  action: faker.helpers.arrayElement(['Checked in', 'Reserved', 'Feedback']),
  time: faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}));

const RecentActivity = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
    <h2 className="text-lg font-semibold text-blue-700 mb-4">Recent Member Activity</h2>
    <ul className="flex-1 overflow-y-auto">
      {recentMembers.map((m, i) => (
        <li key={i} className="mb-3 flex items-center gap-3">
          <img src={faker.image.avatar()} alt="" className="w-8 h-8 rounded-full border border-yellow-400" />
          <div>
            <span className="font-semibold text-gray-800">{m.name}</span>
            <span className="ml-2 text-gray-500 text-sm">{m.action} at {m.time}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentActivity;
