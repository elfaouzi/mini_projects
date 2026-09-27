import { useState } from 'react';
import { motion } from 'framer-motion';
import { seances } from '../../utils/fakedata/seances';
// import createSeance from '../../utils/api'; // Uncomment if default export
import { createSeance } from '../../utils/api'; // Use this if named export exists

// If createSeance is not exported, you need to export it from '../../utils/api':
// export const createSeance = ... // in ../../utils/api.ts

const specialties = Array.from(new Set(seances.map(s => s.specialty)));

const AddSeance = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    specialty: specialties[0] || '',
    maxMembers: 10,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!form.title.trim()) {
      setError('Please enter a seance title');
      setLoading(false);
      return;
    }
    
    if (!form.date) {
      setError('Please select a date');
      setLoading(false);
      return;
    }
    
    if (!form.time) {
      setError('Please select a time');
      setLoading(false);
      return;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(`${form.date}T${form.time}`);
    const now = new Date();
    if (selectedDate <= now) {
      setError('Please select a future date and time');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare seance data for API
      const seanceData = {
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        specialty: form.specialty,
        maxMembers: parseInt(form.maxMembers.toString()),
        // Additional fields that might be required by backend
        description: form.title.trim(), // Use title as description for now
        duration: 60, // Default duration in minutes
        status: 'active'
      };

      console.log('Creating seance with data:', seanceData);
      
      // Call the API to create seance
      const response = await createSeance(seanceData);
      console.log('Seance created successfully:', response);
      
      // Reset form and show success message
      setForm({
        title: '',
        date: '',
        time: '',
        specialty: specialties[0] || '',
        maxMembers: 10,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error creating seance:', error);
      
      // Handle different types of errors
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError('Failed to create seance. Please try again.');
      }
      
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="max-w-xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Seance</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="title" value={form.title} onChange={handleChange} required placeholder="Seance Title" className="rounded-lg border px-4 py-2 shadow focus:outline-none" />
        <div className="flex gap-4">
          <input name="date" type="date" value={form.date} onChange={handleChange} required className="rounded-lg border px-4 py-2 shadow flex-1" />
          <input name="time" type="time" value={form.time} onChange={handleChange} required className="rounded-lg border px-4 py-2 shadow flex-1" />
        </div>
        <select name="specialty" value={form.specialty} onChange={handleChange} className="rounded-lg border px-4 py-2 shadow">
          {specialties.map(s => <option key={s}>{s}</option>)}
        </select>
        <input name="maxMembers" type="number" min={1} max={50} value={form.maxMembers} onChange={handleChange} className="rounded-lg border px-4 py-2 shadow" />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-2 rounded-lg shadow transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Add Seance'
          )}
        </button>
        
        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-green-600 font-bold mt-2 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            ✅ Seance added successfully!
          </motion.div>
        )}
        
        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-red-600 font-bold mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            ❌ {error}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default AddSeance;
