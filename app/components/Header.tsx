'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { Inbox, FileText, Crown, Laptop, LogOut, User } from 'lucide-react'
import MobileMenu from './MobileMenu'
import { getUserSubscription } from '../utils/subscription'

interface Subscription {
  plan: 'free' | 'pro' | 'enterprise'
  status: string
  expires_at: string
}

export default function Header() {
  const { deviceId, isGoogleLinked, unlinkGoogleAccount, linkGoogleAccount } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    const loadSubscription = async () => {
      if (deviceId) {
        const userSubscription = await getUserSubscription(deviceId)
        setSubscription(userSubscription)
      }
    }
    loadSubscription()
  }, [deviceId])

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
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white">
                BETA
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
                <span>Received</span>
              </Link>
              <Link
                href="/devices"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Laptop className="w-5 h-5" />
                <span>Devices</span>
              </Link>
              <Link
                href="/pricing"
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Crown className="w-5 h-5" />
                <span>Pricing</span>
              </Link>
            </nav>
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center gap-4">
            {isGoogleLinked ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {subscription && subscription.plan !== 'free' && (
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlanBadgeColor(subscription.plan)} text-white text-sm font-medium`}>
                      {subscription.plan === 'enterprise' ? 'Enterprise' : 'Pro'}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-5 h-5" />
                    <span>Connected</span>
                  </div>
                </div>
                <button
                  onClick={unlinkGoogleAccount}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  title="Unlink Google Account"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={linkGoogleAccount}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                title="Sign in with Google"
              >
                <Image 
                  src="/google-icon.svg" 
                  alt="Google" 
                  width={20} 
                  height={20}
                />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <MobileMenu subscription={subscription} />
        </div>
      </div>
    </header>
  )
} 