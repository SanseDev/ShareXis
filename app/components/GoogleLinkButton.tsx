'use client'

import { useAuth } from '../contexts/AuthContext'
import Image from 'next/image'

export default function GoogleLinkButton() {
  const { linkGoogleAccount } = useAuth()

  return (
    <button
      onClick={linkGoogleAccount}
      className="w-full bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
    >
      <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
      <span>Se connecter avec Google</span>
    </button>
  )
} 