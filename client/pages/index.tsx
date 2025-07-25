import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, loading } = useAuth(); // include loading from context
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000); // slight delay for better UX
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (loading || redirecting) {
    return (
      <main className="flex flex-col items-center justify-center h-[80vh] bg-gray-900 text-white">
        <div className="animate-pulse text-center space-y-4">
          <h1 className="text-2xl font-semibold">Redirecting to your dashboard...</h1>
          <div className="h-3 w-48 bg-gray-700 rounded mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to ShareIt</h1>
      <Link
        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Login with Google
      </Link>
    </main>
  );
}
