import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { withAuth } from '@/hoc/withAuth';
import { motion } from 'framer-motion';
import {
  FiUploadCloud,
  FiShare2,
  FiFolder,
  FiSearch,
} from 'react-icons/fi';

function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const goToIPFS = () => router.push('/upload/ipfs');
  const goToNetworkShare = () => router.push('/upload/network');
  const goToUserFiles = () => router.push('/view/files');
  const goToRetrieve = () => router.push('/retrieve/retrieveFile');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg bg-gray-950">
        Checking login status...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Welcome, <span className="text-blue-400">{user.email}</span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <DashboardCard
          icon={<FiUploadCloud size={22} />}
          title="Upload to IPFS"
          color="from-blue-500 to-blue-700"
          onClick={goToIPFS}
        />
        <DashboardCard
          icon={<FiShare2 size={22} />}
          title="Network Share"
          color="from-green-500 to-green-700"
          onClick={goToNetworkShare}
        />
        <DashboardCard
          icon={<FiFolder size={22} />}
          title="My Files"
          color="from-gray-600 to-gray-800"
          onClick={goToUserFiles}
        />
        <DashboardCard
          icon={<FiSearch size={22} />}
          title="Retrieve by Alias"
          color="from-purple-600 to-purple-800"
          onClick={goToRetrieve}
        />
      </motion.div>
    </div>
  );
}

function DashboardCard({
  title,
  icon,
  color,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.97 }}
      className={`flex cursor-pointer items-center justify-between px-6 py-5 rounded-lg transition-all duration-300 bg-gradient-to-r ${color} shadow-lg`}
    >
      <span className="flex items-center gap-2 font-semibold text-lg">
        {icon} {title}
      </span>
      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="text-xl font-bold"
      >
        →
      </motion.span>
    </motion.button>
  );
}

export default withAuth(Dashboard);
