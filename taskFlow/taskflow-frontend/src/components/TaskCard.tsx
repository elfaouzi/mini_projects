import React from 'react';
import type { Task, TaskStatus } from '../types/task';

const statusColorMap: Record<TaskStatus, string> = {
  'todo': 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'done': 'bg-emerald-100 text-emerald-700',
};

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView?: (task: Task) => void; // optional details viewer
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onView }) => {
  const date = new Date(task.deadline);
  const formatted = date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800">{task.title}</h3>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColorMap[task.status]}`}>
          {task.status === 'todo' && 'To Do'}
          {task.status === 'in-progress' && 'In Progress'}
          {task.status === 'done' && 'Done'}
        </span>
      </div>
  <p className="mt-2 text-sm leading-5 text-slate-600 line-clamp-3 min-h-[3.75rem]">{task.description}</p>
      <div className="mt-auto pt-3 flex items-center justify-between text-sm">
        <div className="text-slate-500">📅 Due: {formatted}</div>
        <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
          {onView && (
            <button onClick={() => onView(task)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300">
              Details
            </button>
          )}
          <button onClick={() => onEdit(task)} className="rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="rounded-md bg-rose-600 px-3 py-1.5 text-white text-xs font-medium shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
