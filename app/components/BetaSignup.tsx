'use client'

import { useState } from 'react'
import { saveBetaSignup } from '../lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function BetaSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const referrerCode = searchParams.get('ref')
      const { success, error, data } = await saveBetaSignup(email, referrerCode || undefined)

      if (success && data) {
        setStatus('success')
        setEmail('')
        setMessage(data.message || 'Inscription réussie !')
      } else {
        setStatus('error')
        setMessage(error?.message || 'Une erreur est survenue lors de l\'inscription')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setStatus('error')
      setMessage('Une erreur inattendue est survenue')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
            Votre email pour l&apos;accès bêta
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-white transition-all duration-300"
        >
          {status === 'loading' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Inscription en cours...
            </>
          ) : (
            "Rejoindre la bêta"
          )}
        </button>

        {status === 'success' && (
          <div className="p-4 bg-green-500/10 rounded-lg text-green-500 text-center">
            {message}
            <p className="mt-2 text-sm">Vérifiez votre boîte mail pour confirmer votre inscription.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-500/10 rounded-lg text-red-500 text-center">
            {message}
          </div>
        )}
      </form>
    </div>
  )
} 