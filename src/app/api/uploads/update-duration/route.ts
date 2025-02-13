import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { url, duration } = await request.json()

    if (!url || typeof duration !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 从 URL 中提取文件名
    const filename = url.split('/').pop()
    if (!filename) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // 查找包含此媒体的所有 section
    const sections = await prisma.sectionContent.findMany({
      where: {
        media: {
          contains: url
        }
      }
    })

    // 更新每个 section 的媒体数据
    for (const section of sections) {
      try {
        const mediaArray = JSON.parse(section.media || '[]')
        const updatedMedia = Array.isArray(mediaArray) 
          ? mediaArray.map(item => 
              item.url === url 
                ? { ...item, duration } 
                : item
            )
          : mediaArray

        await prisma.sectionContent.update({
          where: { id: section.id },
          data: {
            media: JSON.stringify(updatedMedia)
          }
        })
      } catch (error) {
        console.error('Failed to update section:', error)
      }
    }

    return NextResponse.json({ success: true, duration })
  } catch (error) {
    console.error('Failed to update video duration:', error)
    return NextResponse.json(
      { error: 'Failed to update video duration' },
      { status: 500 }
    )
  }
} 