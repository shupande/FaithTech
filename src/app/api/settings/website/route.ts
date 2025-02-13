import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings/website
export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { type: 'website' }
    })

    if (!settings) {
      return NextResponse.json({
        siteName: '',
        siteDescription: '',
        logo: '',
        favicon: '',
      })
    }

    return NextResponse.json(JSON.parse(settings.data))
  } catch (error) {
    console.error('Failed to fetch website settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch website settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/website
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.siteName) {
      return NextResponse.json(
        { error: 'Site name is required' },
        { status: 400 }
      )
    }

    const settings = await prisma.settings.upsert({
      where: { type: 'website' },
      update: {
        data: JSON.stringify({
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          logo: body.logo,
          favicon: body.favicon,
        }),
      },
      create: {
        type: 'website',
        data: JSON.stringify({
          siteName: body.siteName,
          siteDescription: body.siteDescription,
          logo: body.logo,
          favicon: body.favicon,
        }),
      },
    })

    return NextResponse.json(JSON.parse(settings.data))
  } catch (error) {
    console.error('Failed to save website settings:', error)
    return NextResponse.json(
      { error: 'Failed to save website settings' },
      { status: 500 }
    )
  }
} 