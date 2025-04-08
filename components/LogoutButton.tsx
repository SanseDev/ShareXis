'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 rounded-lg
        bg-gradient-to-r from-red-500 to-red-600
        text-white font-medium text-sm
        hover:from-red-600 hover:to-red-700
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Déconnexion
    </button>
  );
} 