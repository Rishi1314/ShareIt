import { useRouter } from 'next/router';

export default function UploadSelector() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Choose Upload Method</h1>

      <div className="flex gap-6">
        <button
          onClick={() => router.push('/upload/ipfs')}
          className="px-6 py-3 bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-700 transition"
        >
          Upload to IPFS
        </button>

        <button
          onClick={() => router.push('/upload/network')}
          className="px-6 py-3 bg-green-600 text-white cursor-pointer rounded hover:bg-green-700 transition"
        >
          Share Over Network
        </button>
      </div>
    </div>
  );
}
