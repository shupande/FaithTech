import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'

// 验证创建版本的请求
const createVersionSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  version: z.string().min(1, 'Version is required'),
  changelog: z.string().optional(),
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
  
  // 确保目录存在
  await createDirectory(fullPath)
  
  // 保存文件
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(fullPath, fileName), buffer)
  
  return {
    path: `${relativePath}/${fileName}`,
    size: file.size,
  }
}

// 创建目录
async function createDirectory(path: string) {
  const fs = require('fs')
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

// POST /api/media/versions
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data = Object.fromEntries(formData.entries())
    
    // 验证基本数据
    const validatedData = createVersionSchema.parse(data)

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

    // 处理文件上传
    const { path, size } = await handleFileUpload(formData)

    // 创建版本记录
    const version = await prisma.mediaVersion.create({
      data: {
        assetId: validatedData.assetId,
        version: validatedData.version,
        changelog: validatedData.changelog,
        path,
        size,
      },
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
      data: version,
    })
  } catch (error) {
    console.error('Failed to create media version:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create media version' },
      { status: 500 }
    )
  }
} 