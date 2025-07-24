import { useEffect, useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';

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
    <div className="min-h-[80vh] px-4 py-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-white">📁 Your Uploaded Files</h2>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-lg animate-pulse shadow-lg space-y-3"
            >
              <div className="h-4 w-1/2 bg-gray-600 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-600 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-600 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-300">You haven't uploaded any files yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file: any) => (
            <div
              key={file.id}
              className="bg-gray-800 text-white p-5 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div className="mb-2">
                <span className="text-sm text-gray-400">Alias</span>
                <p className="font-semibold">{file.alias}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-400">Filename</span>
                <p>{file.fileName}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-400">Type</span>
                <p>{file.mimeType}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-400">Uploaded</span>
                <p>{new Date(file.createdAt).toLocaleString()}</p>
              </div>
              <div className="truncate mb-4">
                <span className="text-sm text-gray-400">CID</span>
                <p className="text-sm break-words">{file.cid}</p>
              </div>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                🔗 View on IPFS
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(UserFilesPage);
