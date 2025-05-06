import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { getPlanLimits } from '../../utils/subscription'

export async function POST(request: NextRequest) {
  try {
    const { orderID, deviceId, plan } = await request.json()

    // Log des données reçues
    console.log('Données de vérification PayPal reçues:', {
      orderID,
      deviceId,
      plan,
      timestamp: new Date().toISOString()
    })

    // Validation des données
    if (!orderID) {
      console.error('Erreur de validation: ID de commande PayPal manquant')
      return NextResponse.json(
        { error: 'ID de commande PayPal manquant' },
        { status: 400 }
      )
    }

    if (!deviceId) {
      console.error('Erreur de validation: ID de l\'appareil manquant')
      return NextResponse.json(
        { error: 'ID de l\'appareil manquant' },
        { status: 400 }
      )
    }

    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      console.error('Erreur de validation: Plan invalide', { plan })
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      )
    }

    try {
      // Vérifier si cette commande PayPal a déjà été traitée
      const { data: existingOrders } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('payment_provider', 'paypal')
        .eq('payment_provider_order_id', orderID)

      if (existingOrders && existingOrders.length > 0) {
        console.log('Commande PayPal déjà traitée:', {
          orderID,
          subscriptionId: existingOrders[0].id
        })
        return NextResponse.json({ 
          success: true, 
          subscription: existingOrders[0],
          message: 'Cet ordre de paiement a déjà été traité'
        })
      }
    } catch (error) {
      // Si l'erreur est due à la colonne manquante, on continue
      console.warn('Erreur lors de la vérification du payment_provider_order_id:', error)
    }

    // Désactiver tous les abonnements actifs existants
    const { error: deactivateError } = await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', deviceId)
      .eq('status', 'active')

    if (deactivateError) {
      console.error('Erreur lors de la désactivation des abonnements existants:', deactivateError)
      // On continue malgré l'erreur car ce n'est pas critique
    }

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    // Obtenir les limites du plan
    const planLimits = getPlanLimits(plan as 'free' | 'pro' | 'enterprise')

    // Créer le nouvel abonnement avec les limites incluses
    const { data: subscription, error: createError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: deviceId,
        plan,
        status: 'active',
        payment_provider: 'paypal',
        payment_provider_order_id: orderID,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        max_file_size: planLimits.MAX_FILE_SIZE,
        daily_shares: planLimits.DAILY_SHARES === Infinity ? -1 : planLimits.DAILY_SHARES,
        storage_days: planLimits.STORAGE_DAYS === Infinity ? -1 : planLimits.STORAGE_DAYS,
        encryption_level: planLimits.ENCRYPTION_LEVEL
      })
      .select()
      .single()

    if (createError) {
      console.error('Erreur lors de la création de l\'abonnement:', createError)
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'abonnement' },
        { status: 500 }
      )
    }

    console.log('Abonnement PayPal créé avec succès:', {
      subscriptionId: subscription.id,
      orderID,
      deviceId,
      plan,
      limits: {
        max_file_size: planLimits.MAX_FILE_SIZE,
        daily_shares: planLimits.DAILY_SHARES,
        storage_days: planLimits.STORAGE_DAYS,
        encryption_level: planLimits.ENCRYPTION_LEVEL
      }
    })

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Abonnement créé avec succès'
    })

  } catch (error: any) {
    console.error('Erreur inattendue lors de la vérification du paiement PayPal:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de la vérification du paiement',
        details: error?.message
      },
      { status: 500 }
    )
  }
} 