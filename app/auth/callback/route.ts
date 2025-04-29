import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Échanger le code contre une session
    await supabase.auth.exchangeCodeForSession(code)

    // Récupérer la session actuelle
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      // Créer un cookie pour stocker temporairement l'ID utilisateur
      const response = NextResponse.redirect(new URL('/pricing', request.url))
      response.cookies.set('user_id', session.user.id, {
        path: '/',
        maxAge: 60 * 5, // 5 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })
      return response
    }
  }

  // Rediriger vers la page de tarification
  return NextResponse.redirect(new URL('/pricing', request.url))
}