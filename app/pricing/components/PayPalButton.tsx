import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

interface PayPalError {
  message: string;
  code?: string;
  details?: Array<{
    field?: string;
    issue?: string;
    location?: string;
  }>;
}

interface PayPalButtonProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: PayPalError) => void;
}

function isPayPalError(error: unknown): error is PayPalError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as PayPalError).message === 'string'
  );
}

export default function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const router = useRouter();

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "EUR",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "EUR",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const order = await actions.order.capture();
            console.log("Paiement réussi", order);
            onSuccess?.();
            // Rediriger vers la page de succès
            router.push("/success");
          }
        }}
        onError={(err) => {
          console.error("Erreur PayPal:", err);
          if (isPayPalError(err)) {
            onError?.(err);
          } else {
            onError?.({ message: 'Une erreur inattendue est survenue' });
          }
        }}
      />
    </PayPalScriptProvider>
  );
} 