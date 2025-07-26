import { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function RetrievePage() {
  const { user } = useAuth();

  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);

  const handleRetrieve = async () => {
    if (!alias.trim()) {
      setError('❌ File alias is required to proceed.');
      return;
    }

    setLoading(true);
    setSkeleton(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/retrieve`,
        { alias, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.cid) {
        window.open(`https://gateway.pinata.cloud/ipfs/${response.data.cid}`, '_blank');
      } else {
        setError('❌ No file found or the credentials provided are incorrect.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || '❌ Retrieval failed. Please check your details.');
    } finally {
      setLoading(false);
      setSkeleton(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg shadow-xl bg-gray-800 border border-gray-700 space-y-6">
        <h2 className="text-3xl font-bold text-center mb-4">🔍 Retrieve Your File</h2>

        <div className="space-y-2">
          <label htmlFor="alias" className="block text-sm font-semibold">🔖 File Alias</label>
          <input
            id="alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., project-report-2025"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold">🔐 Password (optional)</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password if set"
          />
        </div>

        {error && (
          <div className="text-red-400 bg-red-900 bg-opacity-30 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleRetrieve}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 py-2 rounded hover:bg-blue-700 transition ${
            loading ? 'cursor-not-allowed opacity-70' : ''
          }`}
          disabled={loading}
        >
          {loading && <AiOutlineLoading3Quarters className="animate-spin" size={18} />}
          {loading ? 'Retrieving...' : 'Retrieve File'}
        </button>

        {skeleton && (
          <div className="animate-pulse mt-6 bg-gray-600 h-32 rounded w-full"></div>
        )}
      </div>
    </div>
  );
}

export default withAuth(RetrievePage);
