'use client'

import Header from '../components/Header'
import { Construction, Laptop, Smartphone } from 'lucide-react'

export default function Devices() {
  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <Header />
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#1a1d24] p-8 rounded-2xl border border-gray-800/30">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Laptop className="w-12 h-12 text-[#4d7cfe]" />
                <Smartphone className="w-8 h-8 text-[#4d7cfe] absolute -bottom-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Device Management Coming Soon</h1>
            
            <p className="text-gray-400 mb-6">
              We&apos;re working hard to bring you a powerful device management feature.
              This will allow you to manage all your connected devices in one place.
            </p>

            <div className="bg-[#4d7cfe]/10 p-6 rounded-xl mb-8">
              <Construction className="w-8 h-8 text-[#4d7cfe] mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Under Development</h2>
              <p className="text-gray-400">
                Our team is currently developing this feature to ensure the best possible experience for managing your devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-[#1f2937] p-4 rounded-xl">
                <h3 className="font-medium mb-2">What to expect:</h3>
                <ul className="text-gray-400 space-y-2">
                  <li>• Multiple device management</li>
                  <li>• Secure device authentication</li>
                  <li>• Real-time device status</li>
                  <li>• Easy device removal</li>
                </ul>
              </div>
              
              <div className="bg-[#1f2937] p-4 rounded-xl">
                <h3 className="font-medium mb-2">Coming features:</h3>
                <ul className="text-gray-400 space-y-2">
                  <li>• Device activity monitoring</li>
                  <li>• Custom device names</li>
                  <li>• Device-specific settings</li>
                  <li>• Security notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 