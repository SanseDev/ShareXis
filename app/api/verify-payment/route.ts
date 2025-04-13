import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSubscription } from '../../utils/subscription'

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

    // Créer l'abonnement dans la base de données
    const subscription = await createSubscription(
      session.client_reference_id!,
      session.metadata?.plan as 'free' | 'pro' | 'enterprise',
      session.subscription as string
    )

    if (!subscription) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'abonnement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    )
  }
} 