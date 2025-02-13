import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Get token from cookie
    const token = cookies().get('token')?.value

    if (token) {
      // Delete session
      await prisma.session.deleteMany({
        where: { token },
      })

      // Delete cookie
      cookies().delete('token')
    }

    return NextResponse.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('[AUTH_LOGOUT]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 