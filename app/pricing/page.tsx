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
              Choose your plan
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Solutions adapted to all your file sharing needs,
              from the free version to advanced features for businesses.
            </p>
          </div>

          {/* Grille des prix */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plan Gratuit */}
            <div className="bg-[#1a1d24] rounded-2xl p-8 border border-gray-800/30 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-gray-400">For personal use</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0€</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Up to 100 MB per file</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>5 shares per day</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>7 days storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Basic encryption</span>
                </li>
              </ul>
            </div>

            {/* Plan Pro */}
            <div className="bg-gradient-to-b from-[#1a1d24] to-[#1a1d24] rounded-2xl p-8 border-2 border-[#4d7cfe] relative flex flex-col h-full">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#4d7cfe] to-[#00c2ff] rounded-full text-sm font-medium">
                Popular
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-gray-400">For professionals</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">9.99€</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Up to 5 GB per file</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Unlimited shares</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>30 days storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Advanced encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Detailed statistics</span>
                </li>
              </ul>

              <div className="text-center py-3 rounded-xl bg-[#232730] text-gray-400">
                Coming soon
              </div>
            </div>

            {/* Plan Entreprise */}
            <div className="bg-[#1a1d24] rounded-2xl p-8 border border-gray-800/30 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-gray-400">For large teams</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">29.99€</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Up to 20 GB per file</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Unlimited shares</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Unlimited storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Military-grade encryption</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Advanced administration</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#4d7cfe]" />
                  <span>Priority support</span>
                </li>
              </ul>

              <div className="text-center py-3 rounded-xl bg-[#232730] text-gray-400">
                Coming soon
              </div>
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