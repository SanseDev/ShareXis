'use client'

import { useAuth } from "../contexts/AuthContext"
import { Check } from "lucide-react"

export default function GoogleLinkStatus() {
  const { isGoogleLinked, googleEmail } = useAuth()

  if (!isGoogleLinked) return null

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
      <Check className="w-5 h-5" />
      <div className="flex flex-col">
        <span>Compte Google lié avec succès</span>
        {googleEmail && (
          <span className="text-sm text-green-700">{googleEmail}</span>
        )}
      </div>
    </div>
  )
}
 