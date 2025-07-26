import { useEffect, useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { FiFolder, FiLink, FiSearch } from 'react-icons/fi';

interface FileData {
  id: number;
  alias: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  cid: string;
}

function UserFilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 3;

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/user-files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sorted = sortFiles(response.data.files, sortOrder);
        setFiles(sorted);
        setFilteredFiles(sorted);
      } catch (error) {
        console.error('Failed to fetch files:', error);
        alert('Error fetching uploaded files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [sortOrder]);

  const sortFiles = (files: FileData[], order: 'newest' | 'oldest') => {
    return [...files].sort((a, b) =>
      order === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = files.filter(
      (file) =>
        file.alias.toLowerCase().includes(term) ||
        file.fileName?.toLowerCase().includes(term)
    );
    setFilteredFiles(filtered);
    setCurrentPage(1);
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  return (
    <div className="min-h-screen px-4 py-10 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center mb-6 flex justify-center items-center gap-2">
        <FiFolder size={28} /> Your Uploaded Files
      </h2>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <FiSearch className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by alias or filename..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 rounded bg-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="bg-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">🔽 Newest First</option>
          <option value="oldest">🔼 Oldest First</option>
        </select>
      </div>

      {/* Loading */}
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
      ) : filteredFiles.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">🚫 No files match your search.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {currentFiles.map((file) => (
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default withAuth(UserFilesPage);
