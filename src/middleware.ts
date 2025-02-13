import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    })

    // Check user role
    if (payload.role !== 'admin') {
      console.log('User is not an admin:', payload)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Add user info to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-user-role', payload.role as string)

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE] Error verifying token:', error)
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: '/admin/:path*',
} 