import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { updateUser } from '../utils/api';

type User = {
  id: number;
  fullName: string;
  email: string;
  role: 'member' | 'coach';
  phone: string;
  subscription?: string;
  subscriptionStart?: string;
  specialty?: string;
  experience?: number;
};

export type EditUserFormProps = {
  user: User;
  onClose: () => void;
  onSave?: (user: User) => void; // Made optional since we now update state directly
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function EditUserForm({ user, onClose, onSave, users, setUsers }: EditUserFormProps) {
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingForm, setPendingForm] = useState<typeof form | null>(null);

  // Only allow editing fields except role and subscriptionStart
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'role' || name === 'subscriptionStart') return;
    setForm({ ...form, [name]: value });
  };

  // When user tries to change subscriptionStart, ask for confirmation
  const handleSubscriptionStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingForm({ ...form, subscriptionStart: e.target.value });
    setShowConfirm(true);
  };

  // Accept the pending subscriptionStart change
  const confirmSubscriptionStart = () => {
    if (pendingForm) setForm(pendingForm);
    setShowConfirm(false);
    setPendingForm(null);
  };

  // Cancel the pending subscriptionStart change
  const cancelSubscriptionStart = () => {
    setShowConfirm(false);
    setPendingForm(null);
  };

  // Show a diff preview before saving
  const [showPreview, setShowPreview] = useState(false);
  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare form data to send to backend
      // Form structure sent to API:
      // {
      //   fullName: string,
      //   email: string,
      //   phone: string,
      //   subscription?: string (for members only),
      //   subscriptionStart?: string (for members only),
      //   specialty?: string (for coaches only),
      //   experience?: number (for coaches only)
      // }
      
      const updateData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        ...(form.role === 'member' && {
          subscription: form.subscription,
          subscriptionStart: form.subscriptionStart
        }),
        ...(form.role === 'coach' && {
          specialty: form.specialty,
          experience: form.experience
        })
      };

      console.log('Sending update data to backend:', updateData);
      
      // Call the API to update user
      const response = await updateUser(form.id, updateData);
      console.log('User updated successfully:', response);
      
      // Update the users array directly for instant UI update
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === form.id ? form : u
        )
      );
      
      // Call the parent onSave function with updated user data (if provided)
      if (onSave) {
        onSave(form);
      }
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handlePreview}
          className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-6 border-2 border-blue-200"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-xl focus:outline-none"
            aria-label="Close"
          >
            <FaTimes />
          </button>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-2 text-center">Edit User</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-blue-700 font-semibold mb-1">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-blue-700 font-semibold mb-1">Role</label>
                <input
                  name="role"
                  value={form.role}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-400 shadow outline-none transition-all cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-blue-700 font-semibold mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-blue-700 font-semibold mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  required
                />
              </div>
            </div>
            {form.role === 'member' ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-blue-700 font-semibold mb-1">Subscription</label>
                  <input
                    name="subscription"
                    value={form.subscription || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-blue-700 font-semibold mb-1">Start Date</label>
                  <input
                    name="subscriptionStart"
                    type="date"
                    value={form.subscriptionStart || ''}
                    onChange={handleSubscriptionStartChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-400 shadow outline-none transition-all cursor-pointer"
                    readOnly
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-blue-700 font-semibold mb-1">Specialty</label>
                  <input
                    name="specialty"
                    value={form.specialty || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-blue-700 font-semibold mb-1">Experience (years)</label>
                  <input
                    name="experience"
                    type="number"
                    min={0}
                    value={form.experience || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-700 shadow outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
          <motion.button
            type="submit"
            className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.97 }}
            disabled={saving}
          >
            Preview Changes
          </motion.button>
          {/* Preview Modal */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 border-2 border-blue-200"
                  initial={{ scale: 0.85, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 40 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-blue-700 mb-2 text-center">Review Changes</h3>
                  <div className="flex flex-col gap-2 text-gray-700">
                    {(['fullName','email','phone','subscription','subscriptionStart','specialty','experience'] as const).map((key) => (
                      form[key] !== user[key] ? (
                        <div key={key} className="flex gap-2 items-center">
                          <span className="font-semibold capitalize">{key}:</span>
                          <span className="line-through text-red-500">{user[key]?.toString() || '-'}</span>
                          <span className="text-green-600 font-bold">{form[key]?.toString() || '-'}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="button"
                      className=" cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                      onClick={() => setShowPreview(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className=" cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-800"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? <span>Saving...</span> : <span> Save Changes</span>}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Subscription Start Confirmation Modal */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-6 border-2 border-blue-200"
                  initial={{ scale: 0.85, opacity: 0, y: 40 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.85, opacity: 0, y: 40 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <h3 className="text-lg font-bold text-blue-700 mb-2 text-center">Confirm Change</h3>
                  <p className="text-gray-700 text-center">Are you sure you want to change the subscription start date?</p>
                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                      onClick={cancelSubscriptionStart}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-800"
                      onClick={confirmSubscriptionStart}
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
