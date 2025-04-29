'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import { Laptop, Smartphone, Trash2, Star, AlertCircle } from 'lucide-react'
import { getDevicesByGoogleId, removeAuthorizedDevice, DeviceMapping } from '../utils/deviceMapping'

export default function Devices() {
  const router = useRouter()
  const { isAuthenticated, deviceId } = useAuth()
  const [devices, setDevices] = useState<DeviceMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    } else {
      loadDevices()
    }
  }, [isAuthenticated, router])

  const loadDevices = async () => {
    if (!deviceId) return
    
    setLoading(true)
    setError(null)

    try {
      const userDevices = await getDevicesByGoogleId(deviceId)
      setDevices(userDevices)
    } catch (error) {
      console.error('Erreur lors du chargement des appareils:', error)
      setError('Impossible de charger la liste des appareils')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceToRemove: string) => {
    if (deviceToRemove === deviceId) {
      setError('Vous ne pouvez pas supprimer l\'appareil actuel')
      return
    }

    try {
      const success = await removeAuthorizedDevice(deviceToRemove)
      if (success) {
        await loadDevices()
      } else {
        setError('Impossible de supprimer l\'appareil')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'appareil:', error)
      setError('Erreur lors de la suppression de l\'appareil')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mes Appareils</h1>

          {error && (
            <div className="bg-red-500/10 p-4 rounded-lg flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="bg-[#1a1d24] p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {device.is_primary ? (
                      <Laptop className="w-6 h-6 text-[#4d7cfe]" />
                    ) : (
                      <Smartphone className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {device.device_id === deviceId ? 'Cet appareil' : `Appareil ${device.device_id}`}
                        </span>
                        {device.is_primary && (
                          <span className="bg-[#4d7cfe]/10 text-[#4d7cfe] text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        ID: {device.device_id}
                      </div>
                    </div>
                  </div>

                  {!device.is_primary && device.device_id !== deviceId && (
                    <button
                      onClick={() => handleRemoveDevice(device.device_id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Supprimer l'appareil"
                    >
                      <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                    </button>
                  )}
                </div>
              ))}

              {devices.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Aucun appareil trouvé
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 