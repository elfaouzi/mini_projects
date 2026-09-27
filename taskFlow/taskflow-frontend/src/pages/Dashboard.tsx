import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import EditModal from '../components/EditModal';
import TaskDetails from '../components/TaskDetails';
import type { NewTask, Task } from '../types/task';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/api';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Task | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then((data) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpsert = async (payload: NewTask, editingId?: string) => {
    if (editingId) {
      const updated = await updateTask(editingId, payload);
      console.log(updated)
      setTasks((prev) => prev.map((t) => (t._id === editingId ? updated : t)));
      setEditing(null);
    } else {
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    if (editing?._id === id) setEditing(null);
  };

  // Simple counts (no memoization needed)
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <div className="text-xs font-medium text-indigo-700">Total</div>
            <div className="text-2xl font-semibold text-indigo-900">{total}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-700">To Do</div>
            <div className="text-2xl font-semibold text-slate-900">{todo}</div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="text-xs font-medium text-amber-700">In Progress</div>
            <div className="text-2xl font-semibold text-amber-900">{inProgress}</div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <div className="text-xs font-medium text-emerald-700">Done</div>
            <div className="text-2xl font-semibold text-emerald-900">{done}</div>
          </div>
        </section>

        <TaskForm onSubmit={handleUpsert} editingTask={editing ?? undefined} onCancel={() => setEditing(null)} />

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm text-slate-500">Loading tasks…</div>
        ) : (
          <>
            <TaskList
              tasks={tasks.slice(0, 3)}
              onEdit={setEditing}
              onDelete={(id) => setConfirmingDelete(tasks.find(t => t._id === id) ?? null)}
              onView={(task) => setViewing(task)}
            />
            {tasks.length > 3 && (
              <div className="flex justify-center">
                <a href="/tasks" className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow hover:bg-slate-50">
                  Show all ({tasks.length})
                </a>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      <EditModal open={!!editing} task={editing} onClose={() => setEditing(null)}>
        <TaskForm onSubmit={handleUpsert} editingTask={editing ?? undefined} onCancel={() => setEditing(null)} />
      </EditModal>
      {/* Details Modal */}
      <EditModal open={!!viewing} task={viewing} onClose={() => setViewing(null)} title="Task Details">
        {viewing && <TaskDetails task={viewing} />}
      </EditModal>

      {/* Delete confirmation modal */}
      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setConfirmingDelete(null)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-800">Delete Task</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete “{confirmingDelete.title}”?</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setConfirmingDelete(null)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={async () => { await handleDelete(confirmingDelete._id); setConfirmingDelete(null); }} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
