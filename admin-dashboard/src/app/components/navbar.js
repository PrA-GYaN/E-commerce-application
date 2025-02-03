import { useState } from 'react';
import Link from 'next/link';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Navbar({ onPageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link href="/">Admin Pro</Link>
        </div>

        <div className="hidden md:flex space-x-4 gap-7">
          <button
            onClick={() => onPageChange('welcome')}
            className="text-white hover:text-gray-400"
          >
            Home
          </button>
          <button
            onClick={() => onPageChange('categories')}
            className="text-white hover:text-gray-400"
          >
            Categories
          </button>
          <button
            onClick={() => onPageChange('products')}
            className="text-white hover:text-gray-400"
          >
            Products
          </button>
          <button
            onClick={() => onPageChange('analytics')}
            className="text-white hover:text-gray-400"
          >
            Analytics
          </button>

        {/* User Button (only if signed in) */}
        <div className="hidden md:block">
          <ClerkProvider>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/">Sign In</Link>
            </SignedOut>
          </ClerkProvider>
        </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-5">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
                    {/* User Button in mobile */}
                    <ClerkProvider>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <a className="text-white py-2 px-4 hover:bg-gray-700">Sign In</a>
              </Link>
            </SignedOut>
          </ClerkProvider>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-2 pt-4 pb-2">
          <button
            onClick={() => onPageChange('welcome')}
            className="block text-white py-2 px-4 hover:bg-gray-700"
          >
            Welcome
          </button>
          <button
            onClick={() => onPageChange('categories')}
            className="block text-white py-2 px-4 hover:bg-gray-700"
          >
            Categories
          </button>
          <button
            onClick={() => onPageChange('products')}
            className="block text-white py-2 px-4 hover:bg-gray-700"
          >
            Products
          </button>
          <button
            onClick={() => onPageChange('analytics')}
            className="block text-white py-2 px-4 hover:bg-gray-700"
          >
            Analytics
          </button>
        </div>
      </div>
    </nav>
  );
}