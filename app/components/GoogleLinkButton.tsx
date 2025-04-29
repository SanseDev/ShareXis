'use client'

import { useAuth } from '../contexts/AuthContext'

export default function GoogleLinkButton() {
  const { linkGoogleAccount } = useAuth()

  return (
    <button
      onClick={linkGoogleAccount}
      className="w-full bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      <span>Se connecter avec Google</span>
    </button>
  )
} 