import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('La clé secrète Stripe n\'est pas définie')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, deviceId, plan } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant est invalide' },
        { status: 400 }
      )
    }

    type PlanType = 'free' | 'pro' | 'enterprise'
    
    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Le plan est invalide' },
        { status: 400 }
      )
    }

    const planNames: Record<PlanType, string> = {
      free: 'Gratuit',
      pro: 'Pro',
      enterprise: 'Entreprise'
    }

    const validatedPlan = plan as PlanType

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      client_reference_id: deviceId,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `ShareXis ${planNames[validatedPlan]}`,
              description: `Abonnement ${planNames[validatedPlan]} - Device ID: ${deviceId || 'Unknown'}`,
            },
            unit_amount: Math.round(amount * 100), // Conversion en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        deviceId: deviceId || 'Unknown',
        plan: validatedPlan
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error: any) {
    console.error('Erreur lors de la création de la session Stripe:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Erreur lors de la création de la session de paiement'
      },
      { status: 500 }
    )
  }
} 