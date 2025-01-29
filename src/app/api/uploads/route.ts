import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { withErrorHandler, createApiResponse } from '../utils'

// 确保上传目录存在
const uploadDir = join(process.cwd(), 'public/uploads')

// POST /api/uploads
export const POST = withErrorHandler(async (req) => {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    const filePath = join(uploadDir, fileName)
    
    // 将文件写入磁盘
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    
    // 返回文件URL
    const fileUrl = `/uploads/${fileName}`
    return NextResponse.json(createApiResponse({
      url: fileUrl,
      name: file.name,
      size: file.size,
    }))
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    )
  }
})

// 配置 API 路由以禁用默认的 body 解析
export const config = {
  api: {
    bodyParser: false,
  },
} 