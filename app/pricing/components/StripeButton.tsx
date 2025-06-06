'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../../contexts/AuthContext'

interface StripeButtonProps {
  amount: number
  plan: 'free' | 'pro' | 'enterprise'
  onError?: (error: { message: string }) => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeButton({ amount, plan, onError }: StripeButtonProps) {
  const { deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Payment service is currently unavailable')
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          deviceId,
          plan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while creating the session')
      }

      if (!data.id) {
        throw new Error('Invalid session ID')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      })

      if (error) {
        throw error
      }

    } catch (error) {
      console.error('Error initializing Stripe payment:', error)
      onError?.({ 
        message: error instanceof Error ? error.message : 'An error occurred while initializing payment'
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="white" strokeWidth="2"/>
        <path d="M2 10H22" stroke="white" strokeWidth="2"/>
        <path d="M6 15H12" stroke="white" strokeWidth="2"/>
      </svg>
      <span>{isLoading ? 'Loading...' : 'Pay with card'}</span>
    </button>
  )
} 