import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type SectionContentCreate = {
  name: string
  title: string
  description: string
  status?: string
  badge?: string | null
  actions?: string | null
  media?: string | null
  features?: string | null
  mapPoints?: string | null
  featureTitle?: string | null
  featureSubtitle?: string | null
  mapTitle?: string | null
  mapSubtitle?: string | null
}

export async function GET() {
  try {
    const sections = await prisma.sectionContent.findMany({
      where: {
        status: 'Active'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Parse JSON fields
    const parsedSections = sections.map(section => ({
      ...section,
      badge: section.badge ? JSON.parse(section.badge) : null,
      actions: section.actions ? JSON.parse(section.actions) : [],
      media: section.media ? JSON.parse(section.media) : null,
      features: section.features ? JSON.parse(section.features) : [],
      mapPoints: section.mapPoints ? JSON.parse(section.mapPoints) : []
    }))

    return NextResponse.json(parsedSections)
  } catch (error) {
    console.error('Failed to fetch sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Stringify JSON fields
    const processedData: SectionContentCreate = {
      name: data.name,
      title: data.title,
      description: data.description,
      status: data.status || 'Active',
      badge: data.badge ? JSON.stringify(data.badge) : null,
      actions: data.actions ? JSON.stringify(data.actions) : null,
      media: data.media ? JSON.stringify(data.media) : null,
      features: data.features ? JSON.stringify(data.features) : null,
      mapPoints: data.mapPoints ? JSON.stringify(data.mapPoints) : null,
      featureTitle: data.featureTitle || 'Key Features',
      featureSubtitle: data.featureSubtitle || 'Discover what makes our solutions stand out',
      mapTitle: data.mapTitle || 'Remote Connectivity',
      mapSubtitle: data.mapSubtitle || 'Break free from traditional boundaries. Work from anywhere, at the comfort of your own studio apartment. Perfect for Nomads and Travellers.'
    }

    const section = await prisma.sectionContent.create({
      data: processedData
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Failed to create section:', error)
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
} 