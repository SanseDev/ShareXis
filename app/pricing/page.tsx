'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import { Check } from 'lucide-react'
import GoogleLinkButton from '../components/GoogleLinkButton'
import PayPalButton from './components/PayPalButton'
import StripeButton from './components/StripeButton'

export default function Pricing() {
  const { hasSubscription, isGoogleLinked } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSelectPlan = (plan: 'free' | 'pro' | 'enterprise') => {
    setSelectedPlan(plan)
    setError(null)
    setSuccessMessage(null)
  }

  const getPlanPrice = (plan: 'free' | 'pro' | 'enterprise') => {
    switch (plan) {
      case 'free':
        return 0
      case 'pro':
        return 9.99
      case 'enterprise':
        return 29.99
      default:
        return 0
    }
  }

  const handlePaymentError = (error: any) => {
    const errorMessage = error?.message || 'Une erreur inattendue est survenue'
    console.error('Erreur de paiement:', { error, message: errorMessage })
    setError(errorMessage)
    setSuccessMessage(null)
  }

  const handlePaymentSuccess = () => {
    console.log('Paiement réussi')
    setSuccessMessage(`Votre abonnement ${selectedPlan} a été activé avec succès`)
    setError(null)
    // Redirection vers la page de succès après 2 secondes
    setTimeout(() => {
      window.location.href = '/success'
    }, 2000)
  }

  const renderPaymentButtons = () => {
    if (hasSubscription) {
      return (
        <div className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg text-center">
          Vous êtes déjà abonné
        </div>
      )
    }

    if (!isGoogleLinked) {
      return <GoogleLinkButton />
    }

    const amount = getPlanPrice(selectedPlan)
    if (amount === 0) {
      return (
        <div className="text-center text-gray-400">
          Le plan gratuit ne nécessite pas de paiement
        </div>
      )
    }

    return (
      <div className="space-y-4 bg-[#1a1d24] p-6 rounded-xl border border-gray-800/30">
        <h3 className="text-lg font-medium text-center mb-6">Choisissez votre méthode de paiement</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">
            {successMessage}
          </div>
        )}

        <PayPalButton
          amount={amount}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1a1d24] text-gray-400">ou</span>
          </div>
        </div>
        <StripeButton
          amount={amount}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Plans et Tarifs</h1>
            <p className="text-gray-400">Choisissez le plan qui correspond à vos besoins</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan Gratuit */}
            <div 
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedPlan === 'free' 
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/5' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => handleSelectPlan('free')}
            >
              <h2 className="text-2xl font-bold mb-4">Gratuit</h2>
              <p className="text-4xl font-bold mb-6">0€ <span className="text-lg text-gray-400">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>1 appareil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Fichiers jusqu'à 100MB</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Support basique</span>
                </li>
              </ul>
            </div>

            {/* Plan Pro */}
            <div 
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedPlan === 'pro' 
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/5' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => handleSelectPlan('pro')}
            >
              <h2 className="text-2xl font-bold mb-4">Pro</h2>
              <p className="text-4xl font-bold mb-6">9.99€ <span className="text-lg text-gray-400">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>3 appareils</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Fichiers jusqu'à 500MB</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </div>

            {/* Plan Enterprise */}
            <div 
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                selectedPlan === 'enterprise' 
                  ? 'border-[#4d7cfe] bg-[#4d7cfe]/5' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => handleSelectPlan('enterprise')}
            >
              <h2 className="text-2xl font-bold mb-4">Entreprise</h2>
              <p className="text-sm text-gray-400 mb-2">Pour les grandes équipes</p>
              <p className="text-4xl font-bold mb-6">29.99€ <span className="text-lg text-gray-400">/mois</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Jusqu'à 20 GB par fichier</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Partages illimités</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Conservation illimitée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Chiffrement militaire</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Administration avancée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section de paiement */}
          <div className="mt-12 max-w-md mx-auto">
            {renderPaymentButtons()}
          </div>
        </div>
      </main>
    </div>
  )
} 