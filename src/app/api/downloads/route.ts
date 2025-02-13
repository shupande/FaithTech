import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      where: {
        status: 'Active'
      },
      orderBy: [
        {
          featured: 'desc'
        },
        {
          updatedAt: 'desc'
        }
      ]
    })
    return NextResponse.json(downloads)
  } catch (error) {
    console.error('Failed to fetch downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 验证必需字段
    const requiredFields = ['title', 'category', 'fileUrl']
    const missingFields = requiredFields.filter(field => !data[field]?.trim())
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          fields: missingFields 
        },
        { status: 400 }
      )
    }

    // 清理和准备数据
    const downloadData = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      category: data.category.trim(),
      version: data.version?.trim() || null,
      fileUrl: data.fileUrl.trim(),
      fileSize: data.fileSize?.trim() || null,
      fileType: data.fileType?.trim() || null,
      thumbnail: data.thumbnail?.trim() || null,
      featured: Boolean(data.featured),
      status: data.status || 'Active',
      downloads: 0
    }

    console.log('Creating download with data:', downloadData)

    const download = await prisma.download.create({
      data: downloadData
    })

    console.log('Download created:', download)
    return NextResponse.json(download)
  } catch (error) {
    console.error('Failed to create download:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 