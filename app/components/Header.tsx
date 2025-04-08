import DeviceId from './DeviceId'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-[#0f1117] border-b border-[#232730] p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="ShareXis" 
            width={48}
            height={48}
            className="w-12 h-12"
          />
        </div>
        <DeviceId />
      </div>
    </header>
  )
} 