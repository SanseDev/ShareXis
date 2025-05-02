'use client'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface PayPalButtonProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: { message: string }) => void
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  return (
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
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: "EUR"
                  }
                }
              ]
            })
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              const order = await actions.order.capture()
              console.log("Paiement réussi", order)
              onSuccess?.()
            }
          }}
          onError={(err: any) => {
            console.error("Erreur PayPal:", err)
            onError?.({ 
              message: typeof err === 'string' ? err : (err?.message || 'Une erreur est survenue lors du paiement PayPal')
            })
          }}
        />
      </PayPalScriptProvider>
    </div>
  )
} 