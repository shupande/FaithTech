import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const download = await prisma.download.findUnique({
      where: {
        id: params.id
      }
    })
    if (!download) {
      return NextResponse.json(
        { error: 'Download not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(download)
  } catch (error) {
    console.error('Failed to fetch download:', error)
    return NextResponse.json(
      { error: 'Failed to fetch download' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json()
    
    // 验证必需字段
    if (!data.title || !data.description || !data.category || !data.fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const download = await prisma.download.update({
      where: {
        id: params.id
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        version: data.version,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        fileType: data.fileType,
        thumbnail: data.thumbnail,
        featured: data.featured,
        status: data.status
      }
    })

    return NextResponse.json(download)
  } catch (error) {
    console.error('Failed to update download:', error)
    return NextResponse.json(
      { error: 'Failed to update download' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await prisma.download.delete({
      where: {
        id: params.id
      }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete download:', error)
    return NextResponse.json(
      { error: 'Failed to delete download' },
      { status: 500 }
    )
  }
} 