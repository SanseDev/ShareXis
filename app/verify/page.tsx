'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { verifyEmail } from '../lib/supabase'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    const handleVerification = async () => {
      try {
        console.log('Starting verification process')
        
        // Récupérer le hash de l'URL
        const hash = window.location.hash
        console.log('URL hash:', hash)

        if (hash && hash.includes('access_token')) {
          console.log('Processing access token from hash')
          // Traiter le hash pour la session
          const hashParams = new URLSearchParams(hash.substring(1))
          const accessToken = hashParams.get('access_token')
          
          if (accessToken) {
            console.log('Setting session from access token')
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || '',
            })
            
            if (error) {
              console.error('Error setting session:', error)
              throw error
            }
          }
        }

        // Récupérer la session
        console.log('Getting current session')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }
        
        if (!session?.user?.email) {
          console.error('No email in session')
          setStatus('error')
          setMessage('Session invalide. Veuillez réessayer de vous inscrire.')
          return
        }

        console.log('Verifying email:', session.user.email)
        // Vérifier l'email dans notre base de données
        const { success, data, error } = await verifyEmail(session.user.email)

        if (success && data) {
          console.log('Email verified successfully')
          setStatus('success')
          setMessage('Votre email a été vérifié avec succès !')
          if (data.referralLink) {
            console.log('Setting referral link:', data.referralLink)
            setReferralLink(data.referralLink)
          }
        } else {
          console.error('Verification error:', error)
          throw error || new Error('Erreur de vérification')
        }
      } catch (error) {
        console.error('Verification process error:', error)
        setStatus('error')
        setMessage('Une erreur est survenue lors de la vérification. Veuillez réessayer.')
      }
    }

    handleVerification()
  }, [])

  const handleRetry = () => {
    console.log('Redirecting to home page')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Vérification en cours...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">{message}</h2>
            </div>

            {referralLink && (
              <div className="bg-indigo-50 p-4 rounded-lg space-y-3">
                <p className="text-indigo-700 font-medium text-center">
                  Partagez votre lien de parrainage et obtenez 1 mois PRO gratuit pour 3 invitations !
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white rounded border border-indigo-200 text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink)
                    }}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
                  >
                    Copier
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">{message}</h2>
            </div>

            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 