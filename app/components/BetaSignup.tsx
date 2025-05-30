'use client'

import { useState, useEffect } from 'react'
import { saveBetaSignup } from '../lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function BetaSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    setReferralCode(null)

    try {
      const referredBy = searchParams.get('ref')
      const { success, error, referralCode: newReferralCode } = await saveBetaSignup(email, referredBy || undefined)

      if (success) {
        setStatus('success')
        setEmail('')
        if (newReferralCode) {
          setReferralCode(newReferralCode)
        }
      } else {
        setStatus('error')
        setErrorMessage(
          error?.message || 
          error?.details || 
          'An error occurred during registration'
        )
        console.error('Error details:', error)
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage('An unexpected error occurred')
      console.error('Unexpected error:', err)
    }

    setTimeout(() => {
      if (status === 'success') {
        setStatus('idle')
      }
    }, 3000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
            Your email for beta access
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-[#232730] rounded-lg border border-gray-700 focus:border-[#4d7cfe] focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing up...
            </>
          ) : (
            "Join the beta"
          )}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-green-500/10 rounded-lg text-green-500">
            <p className="text-center mb-2">Thank you! You're registered for the beta.</p>
            {referralCode && (
              <div className="mt-4">
                <p className="text-sm mb-2">Refer your friends and get 1 free PRO month for every 3 referrals:</p>
                <div className="bg-green-500/20 p-2 rounded flex items-center justify-between">
                  <code className="text-sm">{`${window.location.origin}?ref=${referralCode}`}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}?ref=${referralCode}`)}
                    className="text-sm px-2 py-1 bg-green-500/30 rounded hover:bg-green-500/40 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-500/10 rounded-lg text-red-500 text-center">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  )
} 