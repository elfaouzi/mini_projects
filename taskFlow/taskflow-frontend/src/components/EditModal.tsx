import React from 'react';
import type { Task } from '../types/task';

export interface EditModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const EditModal: React.FC<EditModalProps> = ({ open, onClose, title = 'Edit Task', children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
};

export default EditModal;
