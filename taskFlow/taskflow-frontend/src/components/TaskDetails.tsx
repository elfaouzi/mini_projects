import React from 'react';
import type { Task, TaskStatus } from '../types/task';

const statusColorMap: Record<TaskStatus, string> = {
  'todo': 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'done': 'bg-emerald-100 text-emerald-700',
};

function daysUntil(deadlineISO: string) {
  const today = new Date();
  const deadline = new Date(deadlineISO);
  // Normalize to midnight for whole-day calculation
  today.setHours(0,0,0,0);
  deadline.setHours(0,0,0,0);
  const diffMs = deadline.getTime() - today.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return days;
}

function timeLabel(deadlineISO: string) {
  const d = daysUntil(deadlineISO);
  if (d > 3) return { label: `${d} days left`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (d > 0) return { label: `${d} day${d === 1 ? '' : 's'} left`, color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (d === 0) return { label: 'Due today', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  const overdue = Math.abs(d);
  return { label: `Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
}

export interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const deadline = new Date(task.deadline);
  const formatted = deadline.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  const remaining = timeLabel(task.deadline);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColorMap[task.status]}`}>
          {task.status === 'todo' && 'To Do'}
          {task.status === 'in-progress' && 'In Progress'}
          {task.status === 'done' && 'Done'}
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        {task.description || 'No description.'}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Deadline</div>
          <div className="mt-1 text-slate-800">📅 {formatted}</div>
        </div>
        <div className={`rounded-lg border ${remaining.color} p-3`}>
          <div className="text-xs">Time Remaining</div>
          <div className="mt-1 font-medium">{remaining.label}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Created</div>
          <div className="mt-1 text-slate-800">{new Date(task.createdAt).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Updated</div>
          <div className="mt-1 text-slate-800">{new Date(task.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
