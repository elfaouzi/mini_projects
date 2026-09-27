// src/utils/fakedata/seances.tsx

export type Seance = {
  id: number;
  title: string;
  coach: string;
  specialty: string;
  date: string; // ISO string
  time: string; // e.g. '18:00'
  duration: number; // in minutes
  members: string[]; // member names
  maxMembers: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
};

export const seances: Seance[] = [
  {
    id: 1,
    title: 'HIIT Power Hour',
    coach: 'Alex Turner',
    specialty: 'HIIT',
    date: '2025-05-22',
    time: '18:00',
    duration: 60,
    members: ['John Doe', 'Jane Smith', 'Emily Clark'],
    maxMembers: 12,
    status: 'upcoming',
    location: 'Studio A',
    notes: 'Bring a towel and water bottle.'
  },
  {
    id: 2,
    title: 'Morning Yoga Flow',
    coach: 'Sophie Lee',
    specialty: 'Yoga',
    date: '2025-05-21',
    time: '07:30',
    duration: 45,
    members: ['Michael Brown', 'Sarah White'],
    maxMembers: 10,
    status: 'completed',
    location: 'Studio B',
    notes: 'Mats provided.'
  },
  {
    id: 3,
    title: 'Strength & Conditioning',
    coach: 'Chris Evans',
    specialty: 'Strength',
    date: '2025-05-23',
    time: '19:00',
    duration: 50,
    members: ['Anna Green', 'Tom Black', 'Lisa Blue', 'Sam Red'],
    maxMembers: 15,
    status: 'upcoming',
    location: 'Main Gym',
    notes: 'Focus on compound lifts.'
  },
  {
    id: 4,
    title: 'Pilates Core',
    coach: 'Emma Watson',
    specialty: 'Pilates',
    date: '2025-05-20',
    time: '17:00',
    duration: 40,
    members: ['Olivia Grey'],
    maxMembers: 8,
    status: 'cancelled',
    location: 'Studio C',
    notes: 'Class cancelled due to coach illness.'
  },
  {
    id: 5,
    title: 'Boxing Basics',
    coach: 'Mike Tyson',
    specialty: 'Boxing',
    date: '2025-05-24',
    time: '20:00',
    duration: 55,
    members: ['Jake Paul', 'Logan Paul'],
    maxMembers: 10,
    status: 'upcoming',
    location: 'Boxing Ring',
    notes: 'Gloves provided.'
  },
  // Add more seances as needed
];
