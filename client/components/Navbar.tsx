'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <nav className="backdrop-blur-lg bg-gray-900/70 px-6 py-4 shadow-md animate-pulse">
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
    <motion.nav
      className="backdrop-blur-lg bg-gray-900/70 text-white px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-gray-800"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight hover:text-blue-400 transition duration-300"
        >
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
              {/* Email with underline hover */}
              <span className="relative group text-sm text-gray-300 cursor-pointer">
                {user.email}
                <span className="absolute left-0 bottom-[-2px] h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </span>

              {/* Logout button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="relative px-4 py-2 rounded text-sm font-medium transition bg-red-600 hover:bg-red-700"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="relative px-4 py-2 rounded text-sm font-medium transition bg-blue-600 hover:bg-blue-700 group"
              >
                Login
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-700 mt-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-300 px-1">{user.email}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-sm font-medium text-left transition"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium text-left transition"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
