import { useRouter } from 'next/router';

export default function UploadSelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Choose Upload Method</h1>

      <div className="flex gap-6">
        <button
          onClick={() => router.push('/upload/ipfs')}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Upload to IPFS
        </button>

        <button
          onClick={() => router.push('/upload/network')}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Share Over Network
        </button>
      </div>
    </div>
  );
}
