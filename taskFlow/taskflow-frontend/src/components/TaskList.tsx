import React from 'react';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onView }) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No tasks yet. Add your first task to get started!
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((t) => (
        <TaskCard key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} onView={onView} />
      ))}
    </div>
  );
};

export default TaskList;
