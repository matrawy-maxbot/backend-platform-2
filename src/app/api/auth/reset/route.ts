import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Auth reset completed',
      timestamp: new Date().toISOString()
    })
    
    // Clear all possible NextAuth cookies with different variations
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      '__Secure-next-auth.pkce.code_verifier'
    ]

    // Clear each cookie with multiple domain/path combinations
    cookieNames.forEach(name => {
      // Clear for current domain and path
      response.cookies.set(name, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      })
      
      // Clear for secure version
      response.cookies.set(name, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
    })

    // Add cache control headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Auth reset error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset auth',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}