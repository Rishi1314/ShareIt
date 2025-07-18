import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const user = useAuth();
        console.log('Dashboard user:', user);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to ShareIt</h1>
      <Link
        href="http://localhost:5000/auth/google"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Login with Google
      </Link>
    </main>
  );
}