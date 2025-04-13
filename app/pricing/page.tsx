'use client'

import { useState } from 'react'
import Header from '../components/Header'
import { Check } from 'lucide-react'
import PaymentModal from '../components/PaymentModal'

export default function Pricing() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string
    price: number
    interval: string
  } | null>(null)

  const handlePlanSelection = (plan: { name: string; price: number; interval: string }) => {
    setSelectedPlan(plan)
    setIsPaymentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      
      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Choisissez votre plan
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Des solutions adaptées à tous vos besoins de partage de fichiers,
              de la version gratuite aux fonctionnalités avancées pour les entreprises.
            </p>
          </div>

          {/* Grille des prix */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan Gratuit */}
            <div className="bg-[#1a1d24] rounded-2xl p-8 border border-gray-800/30">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Gratuit</h3>
                <p className="text-gray-400">Pour un usage personnel</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Jusqu'à 100 MB par fichier</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>5 partages par jour</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Conservation 7 jours</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Chiffrement de base</span>
                </li>
              </ul>

              <button 
                onClick={() => handlePlanSelection({ name: 'Gratuit', price: 0, interval: 'mois' })}
                className="w-full py-3 rounded-xl border-2 border-[#4d7cfe] text-[#4d7cfe] hover:bg-[#4d7cfe] hover:text-white transition-all duration-300"
              >
                Commencer
              </button>
            </div>

            {/* Plan Pro */}
            <div className="bg-gradient-to-b from-[#1a1d24] to-[#1a1d24] rounded-2xl p-8 border-2 border-[#4d7cfe] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] rounded-full text-sm font-medium">
                Populaire
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-gray-400">Pour les professionnels</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">9.99€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Jusqu'à 5 GB par fichier</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Partages illimités</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Conservation 30 jours</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Chiffrement avancé</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Statistiques détaillées</span>
                </li>
              </ul>

              <button 
                onClick={() => handlePlanSelection({ name: 'Pro', price: 9.99, interval: 'mois' })}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] hover:from-[#3d6df0] hover:to-[#00b2ff] text-white transition-all duration-300"
              >
                Commencer l'essai gratuit
              </button>
            </div>

            {/* Plan Entreprise */}
            <div className="bg-[#1a1d24] rounded-2xl p-8 border border-gray-800/30">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Entreprise</h3>
                <p className="text-gray-400">Pour les grandes équipes</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">29.99€</span>
                  <span className="text-gray-400">/mois</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Jusqu'à 20 GB par fichier</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Partages illimités</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Conservation illimitée</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Chiffrement militaire</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Administration avancée</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Support prioritaire</span>
                </li>
              </ul>

              <button 
                onClick={() => handlePlanSelection({ name: 'Entreprise', price: 29.99, interval: 'mois' })}
                className="w-full py-3 rounded-xl bg-[#232730] hover:bg-[#282d36] text-white transition-all duration-300"
              >
                Contacter les ventes
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  )
} 