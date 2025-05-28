'use client'

import { useState } from 'react'
import { saveBetaSignup } from '../lib/supabase'

export default function BetaSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const { success, error } = await saveBetaSignup(email)

      if (success) {
        setStatus('success')
        setEmail('')
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
          <div className="p-4 bg-green-500/10 rounded-lg text-green-500 text-center">
            Thank you! You're registered for the beta.
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