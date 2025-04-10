'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { Inbox, FileText, Crown } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { deviceId } = useAuth()

  return (
    <header className="border-b border-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.svg" 
                alt="ShareXis" 
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-semibold bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] text-transparent bg-clip-text">
                ShareXis
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/documents"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Mes Fichiers
              </Link>
              <Link 
                href="/received"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Inbox className="w-4 h-4" />
                Fichiers Reçus
              </Link>
              <Link 
                href="/pricing"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Crown className="w-4 h-4" />
                Forfaits
              </Link>
            </nav>
          </div>

          {/* User ID */}
          {deviceId && (
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-[#4d7cfe]/10 to-[#00c2ff]/10">
                <span className="text-sm text-gray-400">ID: </span>
                <span className="font-mono text-[#4d7cfe]">{deviceId}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 