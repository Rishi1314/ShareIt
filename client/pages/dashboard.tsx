import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { withAuth } from '@/hoc/withAuth';

function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const goToIPFS = () => router.push('/upload/ipfs');
  const goToNetworkShare = () => router.push('/upload/network');

  if (!user) return <p className="text-center mt-10">Checking login status...</p>;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-bold text-center">Welcome, {user.email}</h1>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={goToIPFS}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Upload File to IPFS
        </button>
        <button
          onClick={goToNetworkShare}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Share File Over Network
        </button>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
