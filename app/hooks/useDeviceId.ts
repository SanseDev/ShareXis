import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer l'ID existant ou en créer un nouveau
    const storedId = localStorage.getItem('device_id')
    if (storedId) {
      setDeviceId(storedId)
    } else {
      const newId = uuidv4()
      localStorage.setItem('device_id', newId)
      setDeviceId(newId)
    }
  }, [])

  return deviceId
} 