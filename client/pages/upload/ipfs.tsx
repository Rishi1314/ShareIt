import { useState } from 'react';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';

function UploadToIPFS() {
  const user = useAuth();
    console.log('Upload user:', user);

  const [formData, setFormData] = useState({
    alias: '',
    file: null as File | null,
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files) {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading to IPFS:', formData);
    // Implement upload logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Upload File to IPFS</h2>

        {/* Alias Input */}
        <div>
          <label className="block text-sm font-medium mb-1">File Alias (required)</label>
          <input
            type="text"
            name="alias"
            required
            value={formData.alias}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. project-pitch"
          />
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Choose File</label>
          <input
            type="file"
            name="file"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
          />
        </div>

        {/* Password Input (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Optional password to restrict access"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Upload to IPFS
        </button>
      </form>
    </div>
  );
}

export default withAuth(UploadToIPFS);
