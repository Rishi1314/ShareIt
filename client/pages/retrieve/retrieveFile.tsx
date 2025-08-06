import { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function RetrievePage() {
  const { user } = useAuth();

  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRetrieve = async () => {
    if (!alias.trim()) {
      toast.warn('📛 File alias is required to proceed.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('🔒 You are not logged in.');
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/retrieve`,
        { alias, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.cid) {
        toast.success('✅ File found! Opening...');
        setTimeout(() => {
          window.open(`https://gateway.pinata.cloud/ipfs/${response.data.cid}`, '_blank');
        }, 800);
      } else {
        toast.error('❌ No file found or incorrect credentials.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || '❌ Retrieval failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <ToastContainer position="top-center" autoClose={3500} theme="dark" />
      <motion.div
        className="w-full max-w-md p-6 rounded-2xl shadow-xl backdrop-blur-md bg-white/5 border border-gray-700 space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center mb-4">🔍 Retrieve Your File</h2>

        {/* Alias Input */}
        <div className="space-y-2">
          <label htmlFor="alias" className="block text-sm font-semibold">🔖 File Alias</label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full border border-gray-600 bg-gray-900 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., project-report-2025"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold">🔐 Password (optional)</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-900 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password if set"
          />
        </div>

        {/* Button */}
        <motion.button
          onClick={handleRetrieve}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded font-semibold transition ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading && <AiOutlineLoading3Quarters className="animate-spin" size={18} />}
          {loading ? 'Retrieving...' : 'Retrieve File'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default withAuth(RetrievePage);
