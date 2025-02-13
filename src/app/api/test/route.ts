import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [websiteSettings, seoSettings] = await Promise.all([
      prisma.settings.findUnique({
        where: { type: 'website' }
      }),
      prisma.globalSEO.findFirst()
    ])

    return NextResponse.json({
      success: true,
      data: {
        websiteSettings,
        seoSettings
      }
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 