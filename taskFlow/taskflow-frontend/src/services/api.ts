import type { NewTask, Task, TaskUpdates } from '../types/task';

// Base URL: default to local backend on port 5000, can be overridden via Vite env
const API_BASE = 'http://192.168.1.143:5000/api';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HttpOptions {
  method?: HTTPMethod;
  body?: unknown;
}

async function http<T = unknown>(path: string, opts: HttpOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${opts.method ?? 'GET'} ${path} failed: ${res.status} ${res.statusText} ${text}`.trim());
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return undefined as T;
  return (await res.json()) as T;
}

// GET /tasks
export const fetchTasks = async (): Promise<Task[]> => {
  return http<Task[]>('/tasks');
};

// POST /tasks
export const createTask = async (task: NewTask): Promise<Task> => {
  return http<Task>('/tasks', { method: 'POST', body: task });
};

// PUT /tasks/:id
export const updateTask = async (id: string, updates: TaskUpdates): Promise<Task> => {
  return http<Task>(`/tasks/${id}`, { method: 'PUT', body: updates });
};

// DELETE /tasks/:id
export const deleteTask = async (id: string): Promise<{ success: boolean } | void> => {
  const res = await http<{ success: boolean } | undefined>(`/tasks/${id}`, { method: 'DELETE' });
  return res ?? { success: true };
};
