import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social-media
export async function GET() {
  try {
    const items = await prisma.socialMedia.findMany({
      orderBy: {
        displayOrder: 'asc'
      },
      select: {
        id: true,
        platform: true,
        url: true,
        icon: true,
        displayOrder: true,
        isActive: true,
        qrCode: true,
        hasQrCode: true,
      }
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to fetch social media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    )
  }
}

// POST /api/social-media
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await prisma.socialMedia.create({
      data: {
        platform: body.platform,
        url: body.url,
        icon: body.icon,
        displayOrder: body.displayOrder,
        isActive: body.isActive,
        qrCode: body.qrCode,
        hasQrCode: body.hasQrCode || false,
      }
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to create social media:', error)
    return NextResponse.json(
      { error: 'Failed to create social media' },
      { status: 500 }
    )
  }
} 