'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Inbox, FileText, Crown, Menu, X, Laptop, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { deviceId, googleEmail, isGoogleLinked, unlinkGoogleAccount } = useAuth()

  const handleUnlinkGoogle = () => {
    unlinkGoogleAccount()
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-400" />
        ) : (
          <Menu className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-[#0f1117]/95 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* User info */}
          {isGoogleLinked && googleEmail && (
            <div className="px-6 py-4 border-b border-gray-800/30">
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <User className="w-5 h-5" />
                <span>{googleEmail}</span>
              </div>
              <button
                onClick={handleUnlinkGoogle}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Délier Google</span>
              </button>
            </div>
          )}

          {/* Navigation links */}
          <nav className="flex flex-col p-6 space-y-4">
            <Link
              href="/documents"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Documents</span>
            </Link>
            <Link
              href="/received"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <Inbox className="w-5 h-5" />
              <span>Reçus</span>
            </Link>
            <Link
              href="/devices"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <Laptop className="w-5 h-5" />
              <span>Appareils</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <Crown className="w-5 h-5" />
              <span>Tarifs</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
} 