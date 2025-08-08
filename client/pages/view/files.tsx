import { useEffect, useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import { FiFolder, FiSearch, FiCopy } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface FileData {
  id: number;
  alias: string;
  fileName: string;
  mimeType: string;
  createdAt: string;
  cid: string;
  pinSize?: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function UserFilesPage() {
  const { user } = useAuth();
  const router = useRouter();
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
        toast.error('❌ Error fetching uploaded files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [sortOrder]);

  const sortFiles = (files: FileData[], order: 'newest' | 'oldest') =>
    [...files].sort((a, b) =>
      order === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

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

  const isPreviewable = (mimeType: string) =>
    mimeType.startsWith('image/') || mimeType === 'application/pdf';

  const handleCopy = (cid: string) => {
    navigator.clipboard.writeText(`https://gateway.pinata.cloud/ipfs/${cid}`);
    toast.success('🔗 IPFS link copied!');
  };

  const handleRetrieveRedirect = (alias: string) => {
    router.push(`/retrieve/retrieveFile?alias=${encodeURIComponent(alias)}`);
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
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
            className="pl-10 pr-4 py-2 rounded bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">🔽 Newest First</option>
          <option value="oldest">🔼 Oldest First</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-gray-900 p-6 rounded-xl animate-pulse shadow-inner backdrop-blur-lg border border-gray-700" />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-lg">🚫 No files found. Try adjusting your search.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <AnimatePresence>
              {currentFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-fit bg-[#0f0f0f]/60 border border-gray-800 backdrop-blur-md p-5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition"
                >
                  {/* Copy Button */}
                  <button
                    className="absolute cursor-pointer top-3 right-4 text-blue-400 hover:text-blue-600 text-sm"
                    onClick={() => handleCopy(file.cid)}
                  >
                    <FiCopy className="inline-block mr-1" /> Copy Link
                  </button>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
                    {/* <div className="col-span-2 text-white font-medium">📛 Alias</div> */}
                     <div className=" cursor-pointer col-span-2 flex items-center min-w-0"                       onClick={() => handleRetrieveRedirect(file.alias)}
>
                      <span
                        className="shrink-0 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gray-800/80 border border-gray-700"
                        title={file.alias}
                      >
                        <span className="uppercase">{file.alias }</span>
              
                      </span>

            
                    </div>
                    {/* <div
                      className="col-span-2 text-blue-400 underline cursor-pointer"
                      onClick={() => handleRetrieveRedirect(file.alias)}
                    >
                      {file.alias}
                    </div> */}

                    <div>📝 Filename</div>
                    <div className="truncate">{file.fileName || 'Unnamed'}</div>

                    <div>📂 Type</div>
                    <div className="truncate">{file.mimeType}</div>

                    <div>📦 Size</div>
                    <div>{formatBytes(file.pinSize || 0)}</div>

                    <div>⏱️ Uploaded</div>
                    <div>{new Date(file.createdAt).toLocaleString()}</div>
                  </div>

                  {/* Preview */}
                  {isPreviewable(file.mimeType) && (
                    file.mimeType === 'application/pdf' ? (
                      <iframe
                        src={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                        title={file.fileName}
                        className="w-full h-48 rounded mb-3"
                      />
                    ) : (
                      <img
                        src={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                        alt={file.fileName}
                        loading="lazy"
                        className="w-full h-48 object-contain rounded mb-3"
                      />
                    )
                  )}

                  {/* View Button */}
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-600 hover:bg-blue-700 transition font-medium py-2 px-4 rounded mt-2"
                  >
                    🔗 View on IPFS
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 text-white">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 cursor-pointer bg-gray-800 rounded disabled:opacity-50"
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
