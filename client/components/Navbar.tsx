'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <nav className="bg-gray-900 px-6 py-4 shadow-md animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 w-24 bg-gray-700 rounded"></div>
          <div className="h-6 w-6 bg-gray-700 rounded-full sm:hidden"></div>
          <div className="hidden sm:flex gap-4">
            <div className="h-6 w-20 bg-gray-700 rounded"></div>
            <div className="h-6 w-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight hover:text-blue-400 transition">
          ShareIt
        </Link>

        {/* Hamburger toggle */}
        <button
          className="sm:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40 mt-4' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
          {user ? (
            <>
              <span className="text-sm text-gray-300 px-1">{user.email}</span>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm font-medium text-left transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium text-left transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
