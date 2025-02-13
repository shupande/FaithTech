import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'

// 验证创建资产的请求
const createAssetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.string().min(1, 'Type is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

// 验证更新资产的请求
const updateAssetSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  subCategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['Active', 'Archived', 'Deleted']).optional(),
  metadata: z.record(z.any()).optional(),
})

// 处理文件上传
async function handleFileUpload(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  // 生成文件路径
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const uniqueId = Math.random().toString(36).substring(2, 15)
  const fileName = `${uniqueId}-${file.name}`
  const relativePath = `/uploads/${year}/${month}`
  const fullPath = join(cwd(), 'public', relativePath)
  
  try {
    // 确保目录存在
    await mkdir(fullPath, { recursive: true })
    
    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(join(fullPath, fileName), buffer)
    
    return {
      path: `${relativePath}/${fileName}`,
      size: file.size,
      mimeType: file.type,
    }
  } catch (error) {
    console.error('Failed to save file:', error)
    throw new Error('Failed to save file')
  }
}

// GET /api/media/assets
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'Active'

    // 构建查询条件
    const where: any = {
      status,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(type && type !== 'all' && { type }),
      ...(category && category !== 'all' && { category }),
    }

    // 获取总数
    const total = await prisma.mediaAsset.count({ where })

    // 获取分页数据
    const assets = await prisma.mediaAsset.findMany({
      where,
      include: {
        versions: true,
        usages: true,
        properties: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch media assets:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch media assets' },
      { status: 500 }
    )
  }
}

// POST /api/media/assets
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    
    // 处理文件上传
    const { path, size, mimeType } = await handleFileUpload(formData)

    // 准备资产数据
    const assetData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      path,
      size,
      mimeType,
      status: 'Active',
    }

    // 创建资产记录
    const asset = await prisma.mediaAsset.create({
      data: assetData,
      include: {
        versions: true,
        usages: true,
        properties: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error('Failed to create media asset:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create media asset' },
      { status: 500 }
    )
  }
}

// PUT /api/media/assets
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Asset ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = updateAssetSchema.parse(body)

    // 更新资产
    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: {
        ...validatedData,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : undefined,
        metadata: validatedData.metadata ? JSON.stringify(validatedData.metadata) : undefined,
      },
      include: {
        versions: true,
        usages: true,
        properties: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error('Failed to update media asset:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update media asset' },
      { status: 500 }
    )
  }
} 