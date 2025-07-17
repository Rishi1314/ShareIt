import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <Link href="/">
        <h1 className="text-xl font-bold">ShareIt</h1>
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span>{user.email}</span>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="http://localhost:5000/auth/google"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}