"use client";

import { motion } from "framer-motion";
import BetaSignup from "./components/BetaSignup";
import { Suspense } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Share your files{" "}
          <span className="text-indigo-600">instantly</span>
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          ShareXis allows you to share your files with simplicity and security.
          No account needed, no size limit.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="flex items-center gap-2 text-gray-800">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Instant transfer</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>Multi-platform</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <Suspense fallback={<div className="w-full h-[200px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>}>
            <BetaSignup />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-100 rounded-lg mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3v-12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Simple</h3>
            <p className="text-gray-700 text-base">Drag and drop your files and get a sharing link instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-100 rounded-lg mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast</h3>
            <p className="text-gray-700 text-base">Ultra-fast transfer thanks to our optimized infrastructure.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
            <div className="p-3 bg-indigo-100 rounded-lg mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Secure</h3>
            <p className="text-gray-700 text-base">End-to-end encryption for all your file transfers.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
