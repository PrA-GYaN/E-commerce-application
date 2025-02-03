"use client";

import { useEffect, useState } from 'react';
import { SignInButton , SignedOut } from '@clerk/nextjs';
import { FaChartLine, FaCogs, FaBox , FaSignInAlt } from 'react-icons/fa'; 

export default function Login() {
  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSignInButton, setShowSignInButton] = useState(false);

  useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setShowSignInButton(true);
      setLoading(false);
    }, 2000);

  }, []);

  useEffect(() => {
    if (!showSignInButton && !loading) {
      window.location.reload();
    }
  }, [showSignInButton, loading]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 animate-gradient-x">
        <div className="relative text-center p-8 bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl max-w-2xl w-full border border-white/10 overflow-hidden z-20">
          <div className="relative z-30">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                AdminPro
              </h1>
              <p className="text-sm text-gray-200 mt-2">
                Your Gateway to Efficient Management
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <FaChartLine className="text-3xl text-blue-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Analytics</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Monitor real-time metrics and gain actionable insights.
                </p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <FaCogs className="text-3xl text-teal-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Category Management</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Manage your categories for your inventory with ease.
                </p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <FaBox  className="text-3xl text-purple-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Inventory Management</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Manage your inventory with ease.
                </p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <FaSignInAlt className="text-3xl text-indigo-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white mt-4">Secure Access</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Enterprise-grade security for your data and systems.
                </p>
              </div>
            </div>
            <div className="mb-8 z-40 relative">
              {!loading && showSignInButton ? (
                <SignedOut>
                  <SignInButton className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-lg z-40">
                    Sign In
                  </SignInButton>
                </SignedOut>
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="text-xs text-gray-300 mt-2">
                © 2025 AdminPro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden z-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.animationDelay,
            }}
          ></div>
        ))}
      </div>
    </>
  );
}
