import { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { FiUploadCloud, FiLoader } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function UploadToIPFS() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    alias: '',
    file: null as File | null,
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [fileNamePreview, setFileNamePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files) {
      setFormData({ ...formData, file: files[0] });
      setFileNamePreview(files[0]?.name || null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.alias || !formData.file) {
      toast.warn('📛 Alias and file are required.');
      return;
    }

    if (formData.alias.length > 50) {
      toast.warn('⚠️ Alias is too long. Max 50 characters.');
      return;
    }

    if (formData.file.size > 50 * 1024 * 1024) {
      toast.warn('⚠️ File size exceeds 50MB limit.');
      return;
    }

    try {
      setLoading(true);
      const JWT = localStorage.getItem('token');
      if (!JWT || !user?.id) {
        toast.error('🔒 Authentication error. Please re-login.');
        return;
      }

      const data = new FormData();
      data.append('file', formData.file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: data,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const pinataJson = await pinataRes.json();

      if (!pinataRes.ok || !pinataJson.IpfsHash) {
        throw new Error(pinataJson.error || 'Pinata upload failed');
      }

      const apiRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/ipfs`,
        {
          alias: formData.alias,
          ipfsResponse: JSON.stringify(pinataJson),
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success(`✅ File uploaded!\nCID: ${pinataJson.IpfsHash}`);
      setFormData({ alias: '', file: null, password: '' });
      setFileNamePreview(null);
      (document.getElementById('file-input') as HTMLInputElement).value = '';

    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.error('⏱️ Upload timed out. Please try again.');
        return;
      }

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const msg = error.response?.data?.error;

        if (status === 409) {
          if (msg?.includes('Alias')) {
            toast.error('⚠️ Alias already exists. Try another one.');
          } else if (msg?.includes('CID')) {
            toast.warn('🗂️ You’ve already uploaded this file.');
          } else {
            toast.error(`⚠️ Conflict: ${msg}`);
          }
        } else {
          toast.error(msg || '❌ Server error. Please retry.');
        }
      } else {
        toast.error(error.message || '❌ Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <ToastContainer position="top-center" autoClose={4000} theme="dark" />
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-6 p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-gray-700 shadow-xl"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <FiUploadCloud size={26} /> Upload File to IPFS
        </h2>

        {/* Alias Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            File Alias <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="alias"
            value={formData.alias}
            required
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. my-project-report"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload File <span className="text-red-400">*</span>
          </label>
          <input
            id="file-input"
            type="file"
            name="file"
            required
            onChange={handleChange}
            className="w-full text-white file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 file:border-0 file:cursor-pointer"
          />
          {fileNamePreview && (
            <p className="mt-2 text-sm text-gray-400">📄 Selected: {fileNamePreview}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Optional password to protect file"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded font-semibold transition ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin text-white" size={18} /> Uploading...
            </>
          ) : (
            <>
              🚀 Upload to IPFS
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}

export default withAuth(UploadToIPFS);
