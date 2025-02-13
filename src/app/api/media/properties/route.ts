import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 验证创建属性的请求
const createPropertySchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
})

// POST /api/media/properties
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = createPropertySchema.parse(body)

    // 检查资产是否存在
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: validatedData.assetId }
    })

    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      )
    }

    // 检查是否已存在相同的键
    const existingProperty = await prisma.mediaProperty.findFirst({
      where: {
        assetId: validatedData.assetId,
        key: validatedData.key,
      }
    })

    if (existingProperty) {
      return NextResponse.json(
        { success: false, message: 'Property key already exists for this asset' },
        { status: 400 }
      )
    }

    // 创建属性
    const property = await prisma.mediaProperty.create({
      data: validatedData,
      include: {
        asset: {
          include: {
            versions: true,
            usages: true,
            properties: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error('Failed to create media property:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create media property' },
      { status: 500 }
    )
  }
}

// DELETE /api/media/properties
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Property ID is required' },
        { status: 400 }
      )
    }

    // 检查属性是否存在
    const property = await prisma.mediaProperty.findUnique({
      where: { id }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, message: 'Property not found' },
        { status: 404 }
      )
    }

    // 删除属性
    await prisma.mediaProperty.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    })
  } catch (error) {
    console.error('Failed to delete media property:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete media property' },
      { status: 500 }
    )
  }
} 