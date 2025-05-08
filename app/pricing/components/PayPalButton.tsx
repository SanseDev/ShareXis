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
      
      // Capture the payment
      const order = await actions.order.capture()
      
      if (order.status !== 'COMPLETED') {
        throw new Error(`Payment was not completed (status: ${order.status})`)
      }
      
      // Encode parameters for URL
      const params = new URLSearchParams({
        paypal_order_id: order.id,
        device_id: deviceId || '',
        plan: plan
      })
      
      // Redirect to success page with encoded parameters
      router.push(`/success?${params.toString()}`)
      
    } catch (error: any) {
      console.error('PayPal payment error:', error)
      const errorMessage = error?.message || 'An error occurred during payment'
      setPaypalError(errorMessage)
      onError?.({ message: errorMessage })
      setIsLoading(false)
    }
  }

  if (!deviceId) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        Error: Device ID not found. Please reconnect.
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
            currency: "USD",
            intent: "capture",
            components: "buttons",
            locale: "en_US"
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
                        currency_code: "USD"
                      },
                      description: `ShareXis ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`
                    }
                  ]
                })
              } catch (error: any) {
                console.error("Error creating PayPal order:", error)
                const errorMessage = error?.message || 'An error occurred while creating the order'
                setPaypalError(errorMessage)
                onError?.({ message: errorMessage })
                return Promise.reject(error)
              }
            }}
            onApprove={handlePayPalApprove}
            onError={(err: any) => {
              console.error("PayPal error:", err)
              const errorMessage = typeof err === 'string' ? err : (err?.message || 'An error occurred during PayPal payment')
              setPaypalError(errorMessage)
              onError?.({ message: errorMessage })
            }}
            onCancel={() => {
              setPaypalError("Payment was cancelled")
              onError?.({ message: "Payment was cancelled" })
            }}
          />
        </PayPalScriptProvider>
      </div>
      
      {isLoading && (
        <div className="text-center mt-4 text-gray-400 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#4d7cfe] border-t-transparent rounded-full animate-spin"></div>
          <span>Redirecting to confirmation page...</span>
        </div>
      )}
    </div>
  )
} 