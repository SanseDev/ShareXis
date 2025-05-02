'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../../contexts/AuthContext'

interface StripeButtonProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: { message: string }) => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeButton({ amount, onSuccess, onError }: StripeButtonProps) {
  const { deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Le service de paiement n\'est pas disponible pour le moment')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          deviceId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la création de la session')
      }

      if (!data.id) {
        throw new Error('ID de session invalide')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      })

      if (error) {
        throw error
      }

    } catch (error: any) {
      console.error('Erreur lors de l\'initialisation du paiement Stripe:', error)
      onError?.({ 
        message: error?.message || 'Une erreur est survenue lors de l\'initialisation du paiement'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full bg-[#635BFF] hover:bg-[#4c46c8] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors h-[48px]"
    >
      <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.2 19.4667C19.2 18.4 20.0667 17.7333 21.7333 17.7333C23.8667 17.7333 26.5333 18.6667 28.6667 20.2667V13.7333C26.2667 12.4667 23.8667 12 21.4667 12C15.7333 12 11.7333 15.2 11.7333 19.8667C11.7333 27.4667 21.8667 26.2667 21.8667 29.3333C21.8667 30.5333 20.8 31.2 19 31.2C16.6 31.2 13.6 30 11.2 28.2667V34.8C13.8667 36.1333 16.6 36.6667 19.2667 36.6667C25.1333 36.6667 29.3333 33.5333 29.3333 28.8C29.2 20.6667 19.2 22.1333 19.2 19.4667Z" fill="white"/>
      </svg>
      <span>{isLoading ? 'Chargement...' : 'Payer avec Stripe'}</span>
    </button>
  )
} 