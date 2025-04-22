'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Inbox, FileText, Crown, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { deviceId } = useAuth()

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
        <div className="p-4">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <Link
              href="/documents"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-xl text-gray-400 hover:text-white transition-colors p-4 rounded-xl hover:bg-gray-800/50"
            >
              <FileText className="w-6 h-6" />
              My Files
            </Link>
            <Link
              href="/received"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-xl text-gray-400 hover:text-white transition-colors p-4 rounded-xl hover:bg-gray-800/50"
            >
              <Inbox className="w-6 h-6" />
              Received Files
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-xl text-gray-400 hover:text-white transition-colors p-4 rounded-xl hover:bg-gray-800/50"
            >
              <Crown className="w-6 h-6" />
              Plans
            </Link>
          </nav>

          {deviceId && (
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10">
              <span className="text-sm text-gray-400">ID: </span>
              <span className="font-mono text-[#4d7cfe]">{deviceId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 