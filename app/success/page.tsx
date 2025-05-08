'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../components/Header'
import { Check } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasVerified = useRef(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const paypalOrderId = searchParams.get('paypal_order_id')
    const deviceId = searchParams.get('device_id')
    const plan = searchParams.get('plan')

    // Éviter les doubles appels
    if (hasVerified.current) {
      return
    }
    hasVerified.current = true

    // Log des paramètres reçus
    console.log('Paramètres reçus:', {
      sessionId,
      paypalOrderId,
      deviceId,
      plan
    })

    if (!sessionId && (!paypalOrderId || !deviceId || !plan)) {
      console.error('Paramètres manquants:', {
        hasSessionId: !!sessionId,
        hasPaypalOrderId: !!paypalOrderId,
        hasDeviceId: !!deviceId,
        hasPlan: !!plan
      })
      setError('Informations de paiement invalides')
      setIsLoading(false)
      return
    }

    // Vérifier le paiement (Stripe ou PayPal)
    const verifyPayment = async () => {
      try {
        let response;
        
        if (sessionId) {
          console.log('Vérification du paiement Stripe...')
          // Vérification Stripe
          response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          })
        } else {
          console.log('Vérification du paiement PayPal...', {
            orderID: paypalOrderId,
            deviceId,
            plan,
          })
          // Vérification PayPal
          response = await fetch('/api/verify-paypal-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderID: paypalOrderId,
              deviceId,
              plan,
            }),
          })
        }

        const data = await response.json()
        console.log('Réponse de l\'API:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la vérification du paiement')
        }

        // Rediriger vers la page des documents après 3 secondes
        setTimeout(() => {
          router.push('/documents')
        }, 3000)
      } catch (error) {
        console.error('Erreur lors de la vérification:', error)
        setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
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
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="py-16 px-4">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#4d7cfe] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400">Chargement...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  )
} 