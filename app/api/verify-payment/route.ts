import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de session manquant' },
        { status: 400 }
      )
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Le paiement n\'a pas été effectué' },
        { status: 400 }
      )
    }

    // Ici, vous pouvez mettre à jour votre base de données pour activer l'abonnement
    // Par exemple, avec Supabase :
    // await supabase
    //   .from('subscriptions')
    //   .insert({
    //     user_id: session.client_reference_id,
    //     plan: session.metadata.plan,
    //     status: 'active',
    //     stripe_subscription_id: session.subscription,
    //   })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    )
  }
} 