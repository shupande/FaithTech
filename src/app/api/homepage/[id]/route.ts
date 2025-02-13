import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, SectionContent } from '@prisma/client'

interface RouteParams {
  params: {
    id: string
  }
}

type SectionContentUpdate = Prisma.SectionContentUpdateInput

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const section = await prisma.sectionContent.findUnique({
      where: {
        id: params.id
      }
    })
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(section)
  } catch (error) {
    console.error('Failed to fetch section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json()
    console.log('Received data:', data)
    
    // 验证必需字段
    if (!data.name || !data.title || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 准备更新数据
    const updateData: SectionContentUpdate = {
      name: data.name,
      title: data.title,
      description: data.description,
      status: data.status,
      badge: data.badge,
      actions: data.actions,
      image: null,
      media: data.media,
      thumbnail: data.thumbnail,
      features: data.features,
      mapPoints: data.mapPoints,
      featureTitle: data.featureTitle || 'Key Features',
      featureSubtitle: data.featureSubtitle || 'Discover what makes our solutions stand out',
      mapTitle: data.mapTitle || 'Remote Connectivity',
      mapSubtitle: data.mapSubtitle || 'Break free from traditional boundaries. Work from anywhere, at the comfort of your own studio apartment. Perfect for Nomads and Travellers.'
    }

    console.log('Update data:', updateData)

    const section = await prisma.sectionContent.update({
      where: {
        id: params.id
      },
      data: updateData
    })

    // 解析返回的数据
    const parsedSection = {
      ...section,
      badge: section.badge ? JSON.parse(section.badge) : null,
      actions: section.actions ? JSON.parse(section.actions) : [],
      media: section.media ? JSON.parse(section.media) : null,
      features: section.features ? JSON.parse(section.features) : [],
      mapPoints: section.mapPoints ? JSON.parse(section.mapPoints) : []
    }

    console.log('Updated section:', parsedSection)

    return NextResponse.json({
      message: 'Section updated successfully',
      data: parsedSection
    })
  } catch (error) {
    console.error('Failed to update section:', error)
    return NextResponse.json(
      { error: 'Failed to update section', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await prisma.sectionContent.delete({
      where: {
        id: params.id
      }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete section:', error)
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
} 