'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    name: string
    price: number
    interval: string
  }
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto'>('card')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleStripePayment = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.name,
          price: plan.price,
          interval: plan.interval,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        console.error('Erreur Stripe:', error)
        setError('Une erreur est survenue lors du paiement. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      setError('Une erreur est survenue lors du paiement. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    onClose()
    router.push('/success')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d24] rounded-2xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Paiement - {plan.name}</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-400 mb-2">Choisissez votre méthode de paiement :</p>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border ${
                paymentMethod === 'card'
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/10'
                  : 'border-gray-800/30'
              }`}
            >
              Carte
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 rounded-xl border ${
                paymentMethod === 'paypal'
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/10'
                  : 'border-gray-800/30'
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`p-4 rounded-xl border ${
                paymentMethod === 'crypto'
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/10'
                  : 'border-gray-800/30'
              }`}
            >
              Crypto
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <button
            onClick={handleStripePayment}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] text-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Payer ${plan.price}€/${plan.interval}`}
          </button>
        )}

        {paymentMethod === 'paypal' && (
          <PayPalScriptProvider options={{ 
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "EUR"
          }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "EUR",
                        value: plan.price.toString(),
                      },
                    },
                  ],
                })
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  try {
                    const order = await actions.order.capture()
                    console.log('Paiement PayPal réussi:', order)
                    handlePaymentSuccess()
                  } catch (error) {
                    console.error('Erreur lors de la capture du paiement PayPal:', error)
                    setError('Une erreur est survenue lors du paiement. Veuillez réessayer.')
                  }
                }
              }}
              onError={(err) => {
                console.error('Erreur PayPal:', err)
                setError('Une erreur est survenue lors du paiement. Veuillez réessayer.')
              }}
              style={{ layout: "vertical" }}
            />
          </PayPalScriptProvider>
        )}

        {paymentMethod === 'crypto' && (
          <div className="text-center text-gray-400">
            <p>Cryptocurrency payment will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  )
} 