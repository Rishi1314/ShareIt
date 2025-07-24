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
    if (!alias) {
      setError('❌ Alias is required');
      return;
    }

    setLoading(true);
    setSkeleton(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/upload/retrieve',
        { alias, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.cid) {
        window.open(`https://gateway.pinata.cloud/ipfs/${response.data.cid}`, '_blank');
      } else {
        setError('❌ File not found or invalid credentials');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || '❌ File not found or invalid credentials');
    } finally {
      setLoading(false);
      setSkeleton(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-gray-900 text-white">
      <div className="w-full max-w-md space-y-6 p-6 rounded-lg shadow-xl bg-gray-800 border border-gray-600">
        <h2 className="text-3xl font-bold text-center">🔍 Retrieve Your File</h2>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">🔖 File Alias</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full border border-gray-500 bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your file alias"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">🔐 Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-500 bg-gray-700 text-white rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Optional password"
          />
        </div>

        {error && (
          <p className="text-red-400 bg-red-900 bg-opacity-30 p-2 rounded text-sm mt-2">
            {error}
          </p>
        )}

        <button
          onClick={handleRetrieve}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 py-2 rounded hover:bg-blue-700 transition ${
            loading ? 'cursor-not-allowed opacity-70' : ''
          }`}
          disabled={loading}
        >
          {loading && (
            <AiOutlineLoading3Quarters className="animate-spin" size={18} />
          )}
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
