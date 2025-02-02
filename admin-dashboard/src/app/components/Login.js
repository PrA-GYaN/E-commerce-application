// pages/login.js (or login.jsx)
"use client"; // This marks the file as a client component

import { useState } from 'react'; // useState needs to be used in a client component
import { Button } from "@/components/ui/button"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isLoggedIn ? 'You are logged in' : 'Not Logged In'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isLoggedIn
            ? 'Welcome back!'
            : 'Click the button below to login.'}
        </p>
        
        <SignInButton className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Sign In
        </SignInButton>
        </div>
    </div>
    </>
  );
}