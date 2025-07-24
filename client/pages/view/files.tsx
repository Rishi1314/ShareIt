import { useEffect, useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { FiFolder, FiLink } from 'react-icons/fi';

function UserFilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/upload/user-files', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(response.data.files);
      } catch (error) {
        console.error('Failed to fetch files:', error);
        alert('Error fetching uploaded files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="min-h-[80vh] px-4 py-10 max-w-6xl mx-auto bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-10 flex justify-center items-center gap-2">
        <FiFolder size={28} /> Your Uploaded Files
      </h2>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-lg animate-pulse space-y-4 shadow-lg">
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">🚫 You haven't uploaded any files yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file: any) => (
            <div
              key={file.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="mb-3">
                <p className="text-sm text-gray-400">📛 Alias</p>
                <p className="font-semibold text-lg">{file.alias}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-400">📝 Filename</p>
                <p className="truncate">{file.fileName || 'Unnamed'}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-400">📂 Type</p>
                <p>{file.mimeType}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-400">🕒 Uploaded</p>
                <p>{new Date(file.createdAt).toLocaleString()}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400">🔑 CID</p>
                <p className="text-sm break-words">{file.cid}</p>
              </div>

              <a
                href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition w-full"
              >
                <FiLink size={18} /> View on IPFS
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(UserFilesPage);
