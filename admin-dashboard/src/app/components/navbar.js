import { useState } from 'react';
import Link from 'next/link';
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
  
export default function Navbar({onPageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">
          <Link href="/">My Website</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <button
            onClick={() => onPageChange('welcome')}
            className="text-white hover:text-gray-400"
          >
            Welcome
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
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-2 pt-4 pb-2">
          <Link href="/" className="block text-white py-2 px-4 hover:bg-gray-700">Home</Link>
          <Link href="/about" className="block text-white py-2 px-4 hover:bg-gray-700">About</Link>
          <Link href="/services" className="block text-white py-2 px-4 hover:bg-gray-700">Services</Link>
          <Link href="/contact" className="block text-white py-2 px-4 hover:bg-gray-700">Contact</Link>
          <ClerkProvider>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
              </ClerkProvider>
        </div>
      </div>
    </nav>
  );
}