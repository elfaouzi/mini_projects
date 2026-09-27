// src/utils/fakedata/subscriptions.tsx
export type Subscription = {
  id: number;
  user: string;
  email: string;
  start: string; // ISO date
  type: 'monthly' | 'yearly';
};

export const subscriptions: Subscription[] = [
  {
    id: 1,
    user: 'Alice Smith',
    email: 'alice@example.com',
    start: '2025-04-25',
    type: 'monthly',
  },
  {
    id: 2,
    user: 'John Doe',
    email: 'john@example.com',
    start: '2024-06-01',
    type: 'yearly',
  },
  {
    id: 3,
    user: 'Maria Garcia',
    email: 'maria@example.com',
    start: '2025-05-10',
    type: 'monthly',
  },
  {
    id: 4,
    user: 'David Johnson',
    email: 'david@example.com',
    start: '2025-03-15',
    type: 'monthly',
  },
  {
    id: 5,
    user: 'Emma Brown',
    email: 'emma@example.com',
    start: '2024-05-22',
    type: 'yearly',
  },
  // Add more as needed
];
