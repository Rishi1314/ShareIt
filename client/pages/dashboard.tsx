// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/router';
// import { withAuth } from '@/hoc/withAuth';

// function Dashboard() {
//   const { user } = useAuth();
//   const router = useRouter();

//   const goToIPFS = () => router.push('/upload/ipfs');
//   const goToNetworkShare = () => router.push('/upload/network');
//   const goToUserFiles = () => router.push('/view/files');
//   const goToRetrieve = () => router.push('/retrieve/retrieveFile');

//   if (!user) return <p className="text-center mt-10">Checking login status...</p>;

//   return (
//     <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 p-6">
//       <h1 className="text-2xl font-bold text-center">Welcome, {user.email}</h1>

//       <div className="flex flex-col sm:flex-row gap-4 mt-4">
//         <button
//           onClick={goToIPFS}
//           className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
//         >
//           Upload File to IPFS
//         </button>
//         <button
//           onClick={goToNetworkShare}
//           className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
//         >
//           Share File Over Network
//         </button>
//         <button
//           onClick={goToUserFiles}
//           className="bg-gray-700 text-white px-6 py-3 rounded hover:bg-gray-800 transition"
//         >
//           View My Files
//         </button>
//         <button
//           onClick={goToRetrieve}
//           className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 transition"
//         >
//           Retrieve File by Alias
//         </button>
//       </div>
//     </div>
//   );
// }

// export default withAuth(Dashboard);
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { withAuth } from '@/hoc/withAuth';
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

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Checking login status...
      </div>
    );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-gray-900 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        Welcome, <span className="text-blue-400">{user.email}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
        <DashboardCard
          icon={<FiUploadCloud size={22} />}
          title="Upload to IPFS"
          color="bg-blue-600 hover:bg-blue-700"
          onClick={goToIPFS}
        />
        <DashboardCard
          icon={<FiShare2 size={22} />}
          title="Network Share"
          color="bg-green-600 hover:bg-green-700"
          onClick={goToNetworkShare}
        />
        <DashboardCard
          icon={<FiFolder size={22} />}
          title="My Files"
          color="bg-gray-700 hover:bg-gray-800"
          onClick={goToUserFiles}
        />
        <DashboardCard
          icon={<FiSearch size={22} />}
          title="Retrieve by Alias"
          color="bg-purple-700 hover:bg-purple-800"
          onClick={goToRetrieve}
        />
      </div>
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
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-6 py-4 rounded-lg transition duration-300 ${color} shadow-lg hover:scale-[1.02]`}
    >
      <span className="flex items-center gap-2 font-semibold text-lg">{icon} {title}</span>
      <span className="text-xl font-bold">&rarr;</span>
    </button>
  );
}

export default withAuth(Dashboard);
