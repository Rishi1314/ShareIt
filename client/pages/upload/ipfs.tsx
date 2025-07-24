import { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';

function UploadToIPFS() {
  const { user } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.alias || !formData.file) {
      alert('Alias and file are required.');
      return;
    }

    try {
      const JWT = localStorage.getItem('token');
      const data = new FormData();
      data.append("file", formData.file);
      
      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            
          },
          body: data,
        }
      );
      const response = await request.json();
      console.log('Request to Pinata:', response);
      const apiResonse = await axios.post(
        'http://localhost:5000/upload/ipfs', {
          
          alias: formData.alias,
          ipfsResponse: JSON.stringify(response),
          userId: user?.id,
          password: formData.password,
      }, {
        headers: {
          'Authorization': `Bearer ${JWT}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('API response:', apiResonse);
      alert(`✅ File uploaded successfully!\nCID: ${response.IpfsHash}`);
      setFormData({ alias: '', file: null, password: '' });
    } catch (error: any) {
      console.error('Error uploading to IPFS:', error);
      alert(error?.response?.data?.error || 'Failed to upload. Try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl space-y-6 p-6 rounded-lg shadow-lg bg-gray-700"
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
            className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
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
