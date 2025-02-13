import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/social-media/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.socialMedia.findUnique({
      where: {
        id: parseInt(params.id)
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

    if (!item) {
      return NextResponse.json(
        { error: 'Social media not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Failed to fetch social media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    )
  }
}

// PUT /api/social-media/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const result = await prisma.socialMedia.update({
      where: {
        id: parseInt(params.id)
      },
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
    console.error('Failed to update social media:', error)
    return NextResponse.json(
      { error: 'Failed to update social media' },
      { status: 500 }
    )
  }
}

// DELETE /api/social-media/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.socialMedia.delete({
      where: {
        id: parseInt(params.id)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete social media:', error)
    return NextResponse.json(
      { error: 'Failed to delete social media' },
      { status: 500 }
    )
  }
} 