'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isGoogleLinked } = useAuth();

  useEffect(() => {
    if (isGoogleLinked) {
      router.push('/documents');
    }
  }, [isGoogleLinked, router]);

  return (
    <div className="min-h-screen bg-[#0f1117] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.svg" 
              alt="ShareXis" 
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] text-transparent bg-clip-text">
              ShareXis
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/documents')}
              className="bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-5 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              {isAuthenticated ? 'Mes Fichiers' : 'Commencer'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-73px)] flex items-center">
        <div className="grid md:grid-cols-2 gap-20 items-center py-24">
          <div className="max-w-xl">
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 leading-[1.1]">
              File sharing
              <span className="block bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] text-transparent bg-clip-text">
                simple and secure
              </span>
            </h2>
            <p className="text-[#8b95a5] text-xl mb-12 leading-relaxed">
              Share your files instantly with maximum security.
              A modern solution for all your sharing needs.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/documents')}
                className="bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] px-8 py-4 rounded-xl transition-all duration-300 text-lg font-medium"
              >
                Get Started Now
              </button>
            </div>
          </div>

          {/* Interface Preview */}
          <div className="relative bg-[#1a1d24] rounded-[28px] p-8 shadow-2xl shadow-black/20 border border-gray-800/30">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.svg" 
                  alt="ShareXis" 
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-gray-400">Sharing Interface</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-[#232730] p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="text-[#8b95a5]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1 h-5 bg-[#1a1d24] rounded-lg"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] rounded-lg flex items-center justify-center text-2xl transition-all duration-300 cursor-pointer hover:from-[#3d6df0] hover:to-[#00b2ff]">+</div>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-4">
              {/* File being shared */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#4d7cfe]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-[#1a1d24] rounded-lg w-3/4"></div>
                      <span className="text-xs text-[#4d7cfe]">In progress...</span>
                    </div>
                    <div className="relative w-full">
                      <div className="h-1.5 bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10 rounded-full">
                        <div className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] rounded-full w-[75%] transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shared file */}
              <div className="bg-[#232730] p-4 rounded-xl hover:bg-[#282d36] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#00c2ff]/10 to-[#4d7cfe]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#00c2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-[#1a1d24] rounded-lg w-2/3"></div>
                      <span className="text-xs text-green-400">Shared</span>
                    </div>
                    <div className="h-3 bg-[#1a1d24] rounded-lg w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
