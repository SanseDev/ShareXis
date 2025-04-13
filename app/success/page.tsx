'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../components/Header'
import { Check } from 'lucide-react'

export default function Success() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      setError('Session de paiement invalide')
      setIsLoading(false)
      return
    }

    // Vérifier le statut de la session Stripe
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification du paiement')
        }

        // Rediriger vers la page des documents après 3 secondes
        setTimeout(() => {
          router.push('/documents')
        }, 3000)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {isLoading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-[#4d7cfe] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400">Vérification de votre paiement...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-red-400">Erreur</h1>
              <p className="text-gray-400">{error}</p>
              <button
                onClick={() => router.push('/pricing')}
                className="mt-4 px-6 py-2 rounded-xl bg-[#232730] hover:bg-[#282d36] transition-colors"
              >
                Retour aux forfaits
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#4d7cfe]/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#4d7cfe]" />
              </div>
              <h1 className="text-2xl font-bold">Paiement réussi !</h1>
              <p className="text-gray-400">
                Votre abonnement a été activé avec succès. Vous allez être redirigé vers votre espace personnel...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 