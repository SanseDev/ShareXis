'use client'

import { useAuth } from '../contexts/AuthContext'
import { Copy } from 'lucide-react'
import { useState } from 'react'

export default function DeviceId() {
  const { deviceId } = useAuth()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (deviceId) {
      await navigator.clipboard.writeText(deviceId.slice(0, 8))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!deviceId) return null

  // Format l'ID pour qu'il soit toujours de la forme "xxxxxxxx"
  const formattedId = deviceId.slice(0, 8)

  return (
    <div className="bg-[#1a1d24] px-4 py-2 rounded-lg flex items-center gap-3 group relative">
      <div>
        <span className="text-sm text-gray-400">ID Appareil</span>
        <div className="font-mono text-sm">{formattedId}</div>
      </div>
      <button
        onClick={handleCopy}
        className="p-2 rounded-md hover:bg-[#232730] transition-colors opacity-0 group-hover:opacity-100"
        title="Copier l'ID"
      >
        <Copy className="w-4 h-4 text-gray-400" />
      </button>
      {copied && (
        <div className="absolute right-0 top-full mt-2 px-3 py-1 bg-[#232730] rounded-md text-sm">
          Copié !
        </div>
      )}
    </div>
  )
} 