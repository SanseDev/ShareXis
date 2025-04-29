'use client'

import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { Inbox, FileText, Crown, Laptop, LogOut, User } from 'lucide-react'
import MobileMenu from './MobileMenu'

export default function Header() {
  const { deviceId, googleEmail, isGoogleLinked, unlinkGoogleAccount } = useAuth()

  return (
    <header className="border-b border-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <Image 
                src="/logo.svg" 
                alt="ShareXis" 
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] text-transparent bg-clip-text">
                ShareXis
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/documents"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </Link>
              <Link
                href="/received"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Inbox className="w-5 h-5" />
                <span>Reçus</span>
              </Link>
              <Link
                href="/devices"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Laptop className="w-5 h-5" />
                <span>Appareils</span>
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Crown className="w-5 h-5" />
                <span>Tarifs</span>
              </Link>
            </nav>
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center gap-4">
            {isGoogleLinked && googleEmail && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-5 h-5" />
                  <span>{googleEmail}</span>
                </div>
                <button
                  onClick={unlinkGoogleAccount}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Délier Google</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
} 