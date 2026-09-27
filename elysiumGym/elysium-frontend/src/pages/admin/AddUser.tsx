import React, { useState } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaIdBadge,
  FaHeartbeat,
  FaPhoneAlt,
  FaMedkit,
  FaChalkboardTeacher,
  FaCertificate,
  FaChartLine,
  FaCalendarCheck,
  FaKey,
} from 'react-icons/fa';
import { register } from '../../utils/api';
import { sendUserCredentialsEmail } from '../../utils/emailService';
import { AnimatePresence, motion } from 'framer-motion';

type InputFieldProps = {
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({ name, type = 'text', placeholder, icon, value, onChange }) => (
  <div className="relative w-full group">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-blue-700 transition-colors">
      {icon}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-md outline-none text-gray-700 placeholder-gray-400 bg-white"
    />
  </div>
);

export default function AddUser() {
  const [role, setRole] = useState<'member' | 'coach'>('member');
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    role: 'member',
    gender: '',
    specialty: '',
    experience: '',
    certifications: '',
    subscriptionStart: today,
    subscription: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedUser, setSubmittedUser] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await register(formDataToSend);
      let password = (response as any).password || '';
      setShowModal(true);
      setSubmittedUser((response as any).user ? { ...(response as any).user, password } : { ...formData, password });

      // Send credentials email via EmailJS
      try {
        await sendUserCredentialsEmail({
          to_email: formData.email,
          to_name: formData.fullName,
          password,
          role: formData.role,
        });
        // You can replace this with a toast/snackbar
        alert('Credentials email sent!');
      } catch (err) {
        alert('User created, but failed to send email.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6  mx-auto    animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 animate-fadeDown">
        Add New {role === 'coach' ? 'Coach' : 'Member'}
      </h1>

      <div className="flex gap-6 mb-6">
        {['member', 'coach'].map(r => (
          <label
            key={r}
            className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all cursor-pointer shadow-sm ${
              role === r
                ? 'bg-blue-100 border-blue-500 text-blue-800'
                : 'bg-white border-gray-300 text-gray-600'
            } hover:shadow-md`}
          >
            <input
              type="radio"
              name="role"
              value={r}
              checked={role === r}
              onChange={() => {setRole(r as 'member' | 'coach')
                setFormData(prev => ({ ...prev, role: r }));
              }}
              className="hidden"
            />
            <span className="capitalize font-semibold">{r}</span>
          </label>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="fullName" placeholder="Full Name" icon={<FaUser />} value={formData.fullName} onChange={handleChange} />
        <InputField name="email" type="email" placeholder="Email Address" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} />
        <InputField name="phone" type="tel" placeholder="Phone Number" icon={<FaPhone />} value={formData.phone} onChange={handleChange} />
        <InputField name="dob" type="date" placeholder="Date of Birth" icon={<FaBirthdayCake />} value={formData.dob} onChange={handleChange} />

        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
            <FaVenusMars />
          </span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm outline-none bg-white text-gray-700"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {role === 'coach' && (
          <>
            <InputField name="specialty" placeholder="Specialty (e.g., Fitness, Yoga)" icon={<FaChalkboardTeacher />} value={formData.specialty} onChange={handleChange} />
            <InputField name="experience" type="number" placeholder="Years of Experience" icon={<FaChartLine />} value={formData.experience} onChange={handleChange} />
            <InputField name="certifications" placeholder="Certifications (optional)" icon={<FaCertificate />} value={formData.certifications} onChange={handleChange} />
          </>
        )}

        {role === 'member' && (
          <>
            
            <InputField name="emergencyContact" placeholder="Emergency Contact Name" icon={<FaUser />} value={formData.emergencyContact} onChange={handleChange} />
            <InputField name="emergencyPhone" placeholder="Emergency Phone" type="tel" icon={<FaPhoneAlt />} value={formData.emergencyPhone} onChange={handleChange} />
            
            <InputField name="medicalInfo" placeholder="Medical Conditions (optional)" icon={<FaMedkit />} value={formData.medicalInfo} onChange={handleChange} />
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                <FaHeartbeat />
              </span>
              <select
                name="subscription"
                value={formData.subscription}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm outline-none bg-white text-gray-700"
              >
                <option value="">Select Subscription</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <InputField name="subscriptionStart" type='date' placeholder="Subscription Start Date" icon={<FaCalendarCheck  />}  value={formData.subscriptionStart} onChange={handleChange} />

          </>
        )}

<button
  type="submit"
  disabled={loading}
  className={`col-span-full mt-6 py-3 px-6 ${
    loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
  } text-white font-semibold rounded-xl transition-all duration-200 shadow-md`}
>
  {loading ? 'Saving...' : `Save ${role === 'coach' ? 'Coach' : 'Member'}`}
</button>
      </form>
      <AnimatePresence>
        {showModal && submittedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 80, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-yellow-300 relative"
            >
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-200 flex items-center justify-center text-4xl text-yellow-900 shadow-lg mb-2">
                  <FaUser />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">User Created!</h2>
                <p className="text-gray-600 mb-2">Share these credentials with the new user:</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left shadow-inner">
                <div className="mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="ml-1 text-gray-900 select-all">{submittedUser.email}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <FaIdBadge className="text-yellow-500" />
                  <span className="font-semibold text-gray-700">Role:</span>
                  <span className="ml-1 text-gray-900 capitalize">{submittedUser.role}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <FaUser className="text-purple-500" />
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="ml-1 text-gray-900">{submittedUser.fullName || submittedUser.name}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <FaKey className="text-green-500" />
                  <span className="font-semibold text-gray-700">Password:</span>
                  <span className="ml-1 text-gray-900 select-all tracking-widest">{submittedUser.password}</span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-2 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg shadow transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

