'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Inbox, FileText, Crown, Menu, X, Laptop, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface MobileMenuProps {
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
  } | null
}

export default function MobileMenu({ subscription }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { googleEmail, isGoogleLinked, unlinkGoogleAccount } = useAuth()

  const handleUnlinkGoogle = () => {
    unlinkGoogleAccount()
    setIsOpen(false)
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'from-[#4d7cfe] to-[#00c2ff]'
      case 'enterprise':
        return 'from-purple-500 to-pink-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
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
              <div className="flex flex-col gap-3">
                {subscription && subscription.plan !== 'free' && (
                  <div className={`self-start px-3 py-1 rounded-full bg-gradient-to-r ${getPlanBadgeColor(subscription.plan)} text-white text-sm font-medium`}>
                    {subscription.plan === 'enterprise' ? 'Enterprise' : 'Pro'}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <User className="w-5 h-5" />
                  <span>{googleEmail}</span>
                </div>
              </div>
              <button
                onClick={handleUnlinkGoogle}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Unlink Google</span>
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
              <span>Received</span>
            </Link>
            <Link
              href="/devices"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <Laptop className="w-5 h-5" />
              <span>Devices</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
            >
              <Crown className="w-5 h-5" />
              <span>Pricing</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
} 