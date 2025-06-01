import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Liste des chemins autorisés
  const allowedPaths = [
    '/',                    // Landing page
    '/_next',              // Next.js resources
    '/api',                // API routes
    '/static',             // Static files
    '/images',             // Images
    '/favicon.ico',        // Favicon
    '/logo.svg',           // Logo
    '/verify',             // Page de vérification email
  ]

  // Vérifier si le chemin actuel est autorisé
  const isAllowedPath = allowedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )

  // Si le chemin n'est pas autorisé, rediriger vers la page d'accueil
  if (!isAllowedPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|static|.*\\..*).*)',
  ],
} 