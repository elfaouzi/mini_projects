import type { ReactNode } from "react";

// src/utils/fakedata/payments.tsx
export type Payment = {
  memberName: ReactNode;
  id: number;
  user: string;
  email: string;
  amount: number;
  date: string; // ISO
  method: 'Credit Card' | 'Cash' | 'Bank Transfer';
  status: 'Paid' | 'Pending' | 'Failed';
};

export const payments: Payment[] = [
  {
    id: 1,
    user: 'Alice Smith',
    email: 'alice@example.com',
    amount: 49.99,
    date: '2025-05-01',
    method: 'Credit Card',
    status: 'Paid',
    memberName: undefined
  },
  {
    id: 2,
    user: 'John Doe',
    email: 'john@example.com',
    amount: 99.99,
    date: '2025-05-03',
    method: 'Cash',
    status: 'Pending',
    memberName: undefined
  },
  {
    id: 3,
    user: 'Maria Garcia',
    email: 'maria@example.com',
    amount: 49.99,
    date: '2025-05-05',
    method: 'Bank Transfer',
    status: 'Paid',
    memberName: undefined
  },
  {
    id: 4,
    user: 'David Johnson',
    email: 'david@example.com',
    amount: 49.99,
    date: '2025-05-07',
    method: 'Credit Card',
    status: 'Failed',
    memberName: undefined
  },
  {
    id: 5,
    user: 'Emma Brown',
    email: 'emma@example.com',
    amount: 99.99,
    date: '2025-05-10',
    method: 'Cash',
    status: 'Paid',
    memberName: undefined
  },
  // Add more as needed
];
