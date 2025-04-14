import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if URL is a direct language path and redirect to home
  const { pathname } = request.nextUrl;
  const languagePathRegex = /^\/(pt-br|en)$/i;
  
  if (languagePathRegex.test(pathname)) {
    // Redirect to homepage
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value
          if (!cookie) return undefined
          // Handle base64-encoded cookies
          if (cookie.startsWith('base64-')) {
            try {
              const base64Value = cookie.replace('base64-', '')
              return Buffer.from(base64Value, 'base64').toString('utf-8')
            } catch (e) {
              console.error('Failed to decode base64 cookie:', e)
              return undefined
            }
          }
          return cookie
        },
        set(name: string, value: string, options: any) {
          // Encode the value as base64
          const encodedValue = `base64-${Buffer.from(value).toString('base64')}`
          request.cookies.set({
            name,
            value: encodedValue,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: encodedValue,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
