'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return null;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          ShareIt
        </Link>

        {/* Mobile toggle button with icon switch */}
        <button
          className="sm:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40 mt-4' : 'max-h-0'
        }`}
      >
        <div className="space-y-2">
          {user ? (
            <>
              <div className="text-sm">{user.email}</div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-left"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
