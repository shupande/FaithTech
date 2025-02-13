import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createReadStream } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 获取资源信息
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    })

    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      )
    }

    // 更新下载次数
    await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    })

    // 记录下载历史
    await prisma.mediaUsage.create({
      data: {
        assetId: params.id,
        entityType: 'download',
        entityId: 'anonymous',
      },
    })

    // 获取文件路径
    const filePath = join(cwd(), 'public', asset.path)

    // 创建文件流
    const fileStream = createReadStream(filePath)

    // 返回文件
    return new NextResponse(fileStream as any, {
      headers: {
        'Content-Type': asset.mimeType,
        'Content-Disposition': `attachment; filename="${asset.name}"`,
      },
    })
  } catch (error) {
    console.error('Failed to download file:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to download file' },
      { status: 500 }
    )
  }
} 