'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface PayPalButtonProps {
  amount: number
  plan: 'free' | 'pro' | 'enterprise'
  onSuccess?: () => void
  onError?: (error: { message: string }) => void
}

export default function PayPalButton({ amount, plan, onSuccess, onError }: PayPalButtonProps) {
  const { deviceId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [paypalError, setPaypalError] = useState<string | null>(null)
  const router = useRouter()

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      setIsLoading(true)
      setPaypalError(null)
      
      // Capture le paiement
      const order = await actions.order.capture()
      
      if (order.status !== 'COMPLETED') {
        throw new Error(`Le paiement n'a pas été complété (status: ${order.status})`)
      }
      
      // Encoder les paramètres pour l'URL
      const params = new URLSearchParams({
        paypal_order_id: order.id,
        device_id: deviceId || '',
        plan: plan
      })
      
      // Rediriger vers la page de succès avec les paramètres encodés
      router.push(`/success?${params.toString()}`)
      
    } catch (error: any) {
      console.error('Erreur lors du paiement PayPal:', error)
      const errorMessage = error?.message || 'Une erreur est survenue lors du paiement'
      setPaypalError(errorMessage)
      onError?.({ message: errorMessage })
      setIsLoading(false)
    }
  }

  if (!deviceId) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        Erreur: ID de l'appareil non trouvé. Veuillez vous reconnecter.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {paypalError && (
        <div className="text-red-500 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          {paypalError}
        </div>
      )}
      
      <div className="[&>div>div]:!rounded-full [&_iframe]:!rounded-full">
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            currency: "EUR",
            intent: "capture",
            components: "buttons",
          }}
        >
          <PayPalButtons
            style={{
              color: "blue",
              layout: "horizontal",
              height: 48,
              tagline: false,
              shape: "pill",
              label: "pay"
            }}
            disabled={isLoading}
            createOrder={(data, actions) => {
              try {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        value: amount.toString(),
                        currency_code: "EUR"
                      },
                      description: `ShareXis ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`
                    }
                  ]
                })
              } catch (error: any) {
                console.error("Erreur lors de la création de la commande PayPal:", error)
                const errorMessage = error?.message || 'Une erreur est survenue lors de la création de la commande'
                setPaypalError(errorMessage)
                onError?.({ message: errorMessage })
                return Promise.reject(error)
              }
            }}
            onApprove={handlePayPalApprove}
            onError={(err: any) => {
              console.error("Erreur PayPal:", err)
              const errorMessage = typeof err === 'string' ? err : (err?.message || 'Une erreur est survenue lors du paiement PayPal')
              setPaypalError(errorMessage)
              onError?.({ message: errorMessage })
            }}
            onCancel={() => {
              setPaypalError("Le paiement a été annulé")
              onError?.({ message: "Le paiement a été annulé" })
            }}
          />
        </PayPalScriptProvider>
      </div>
      
      {isLoading && (
        <div className="text-center mt-4 text-gray-400 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#4d7cfe] border-t-transparent rounded-full animate-spin"></div>
          <span>Redirection vers la page de confirmation...</span>
        </div>
      )}
    </div>
  )
} 