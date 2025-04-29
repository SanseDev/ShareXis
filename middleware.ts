import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Vérifier si nous avons un ID utilisateur temporaire
  const userId = request.cookies.get('user_id')?.value
  const deviceId = request.cookies.get('temp_device_id')?.value

  if (userId && deviceId) {
    try {
      // Mettre à jour l'abonnement avec l'ID Google
      await supabase
        .from('subscriptions')
        .update({ user_id: userId })
        .eq('user_id', deviceId)

      // Supprimer les cookies temporaires
      response.cookies.delete('user_id')
      response.cookies.delete('temp_device_id')
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error)
    }
  }

  return response
}

export const config = {
  matcher: '/pricing'
} 