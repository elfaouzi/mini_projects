export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string; // ISO date (YYYY-MM-DD)
  status: TaskStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export type NewTask = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;
export type TaskUpdates = Partial<NewTask>;
