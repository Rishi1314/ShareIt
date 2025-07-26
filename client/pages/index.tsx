import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading || redirecting) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="animate-pulse text-center space-y-4">
          <h1 className="text-2xl font-semibold">Redirecting to your dashboard...</h1>
          <div className="h-3 w-48 bg-gray-700 rounded mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-950 text-white px-6 py-12 sm:py-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          ShareIt 🔐 — Secure, Smart File Sharing Powered by IPFS
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Upload files to IPFS, assign custom aliases, add optional password protection,
          and retrieve them from anywhere — all under one platform.
        </p>
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg rounded-lg font-semibold transition duration-300 inline-block"
        >
          🔐 Login with Google to Get Started
        </Link>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">📚 How ShareIt Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📤 Upload</h3>
            <p className="text-gray-300 text-sm">
              Log in and select a file from your device. Assign a unique alias
              to identify your file and upload it to the decentralized IPFS network.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure with Password</h3>
            <p className="text-gray-300 text-sm">
              Want more privacy? Set an optional password for each file, ensuring only
              authorized users can retrieve it — perfect for sensitive content.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🔍 Retrieve Anytime</h3>
            <p className="text-gray-300 text-sm">
              Enter the alias (and password if set) on the retrieve page to access
              your file instantly from IPFS. Simple, fast, and globally accessible.
            </p>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="max-w-4xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">🚀 What's Next</h2>
        <p className="text-center text-gray-300 text-lg">
          <span className="font-semibold text-white">You're using ShareIt Phase 1</span>, which focuses on
          secure cloud sharing using IPFS with aliases and optional passwords.
          <br className="hidden sm:block" />
          Up next in <span className="font-semibold text-white">Phase 2</span>: we’re building
          <span className="font-semibold text-blue-400"> real-time peer-to-peer (P2P) file transfer</span> between devices with no cloud dependency.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ShareIt. Built with ❤️ using Next.js, Node.js & IPFS.
      </footer>
    </main>
  );
}
