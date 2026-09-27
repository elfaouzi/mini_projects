import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import EditModal from '../components/EditModal';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';
import type { NewTask, Task, TaskStatus } from '../types/task';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Task | null>(null);

  // Filters
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [sort, setSort] = useState<'deadline-asc' | 'deadline-desc' | 'created-desc'>('deadline-asc');
  const [range, setRange] = useState<'all' | '7d' | '30d' | 'overdue'>('all');

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let arr = [...tasks];
    // search
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      arr = arr.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }
    // status
    if (status !== 'all') arr = arr.filter(t => t.status === status);
    // range
    const today = new Date(); today.setHours(0,0,0,0);
    if (range !== 'all') {
      arr = arr.filter(t => {
        const d = new Date(t.deadline); d.setHours(0,0,0,0);
        const diff = Math.round((d.getTime() - today.getTime()) / (1000*60*60*24));
        if (range === 'overdue') return diff < 0;
        if (range === '7d') return diff >= 0 && diff <= 7;
        if (range === '30d') return diff >= 0 && diff <= 30;
        return true;
      });
    }
    // sort
    if (sort === 'deadline-asc') arr.sort((a,b) => a.deadline.localeCompare(b.deadline));
    if (sort === 'deadline-desc') arr.sort((a,b) => b.deadline.localeCompare(a.deadline));
    if (sort === 'created-desc') arr.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    return arr;
  }, [tasks, q, status, sort, range]);

  const handleUpsert = async (payload: NewTask, editingId?: string) => {
    if (editingId) {
      const updated = await updateTask(editingId, payload);
      setTasks(prev => prev.map(t => t._id === editingId ? updated : t));
      setEditing(null);
    } else {
      const created = await createTask(payload);
      setTasks(prev => [created, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    if (editing?._id === id) setEditing(null);
  };

  const resetFilters = () => {
    setQ('');
    setStatus('all');
    setSort('deadline-asc');
    setRange('all');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Search</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="deadline-asc">Deadline ↑</option>
                <option value="deadline-desc">Deadline ↓</option>
                <option value="created-desc">Newest</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">Range</label>
              <select value={range} onChange={(e) => setRange(e.target.value as any)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All</option>
                <option value="7d">Next 7 days</option>
                <option value="30d">Next 30 days</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">All Tasks</h2>
          <Link to="/" className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-700">Add Task</Link>
        </section>

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-slate-500">Loading tasks…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-2 h-10 w-10 select-none">🔎</div>
            <h3 className="text-base font-semibold text-slate-800">No results</h3>
            <p className="mt-1 text-sm text-slate-600">No tasks match your current filters.</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={resetFilters} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow hover:bg-slate-50">Reset filters</button>
            </div>
          </div>
        ) : (
          <TaskList tasks={filtered} onEdit={setEditing} onDelete={(id) => setConfirmingDelete(tasks.find(t => t._id === id) ?? null)} onView={setViewing} />
        )}
      </main>

      <EditModal open={!!editing} task={editing} onClose={() => setEditing(null)}>
        <TaskForm onSubmit={handleUpsert} editingTask={editing ?? undefined} onCancel={() => setEditing(null)} />
      </EditModal>

      <EditModal open={!!viewing} task={viewing} onClose={() => setViewing(null)} title="Task Details">
        {viewing && <TaskDetails task={viewing} />}
      </EditModal>

      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setConfirmingDelete(null)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-800">Delete Task</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete “{confirmingDelete.title}”?</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setConfirmingDelete(null)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={async () => { await handleDelete(confirmingDelete._id); setConfirmingDelete(null); }} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
