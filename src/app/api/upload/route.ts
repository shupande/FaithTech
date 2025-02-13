import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'
import { existsSync } from 'fs'

// 确保目录存在
async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // 生成基于日期的目录结构
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    
    // 生成唯一文件名
    const ext = file.name.split('.').pop()
    const fileName = `${nanoid()}-${file.name}`
    
    // 构建保存路径
    const relativePath = `/uploads/${year}/${month}`
    const uploadDir = join(process.cwd(), 'public', relativePath)
    
    try {
      // 确保上传目录存在
      await ensureDir(uploadDir)
      
      // 保存文件
      const filePath = join(uploadDir, fileName)
      await writeFile(filePath, Buffer.from(await file.arrayBuffer()))
      
      // 返回文件URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
      const fileUrl = `${relativePath}/${fileName}`
      
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fullUrl: `${baseUrl}${fileUrl}`,
      })
    } catch (error) {
      console.error('Failed to save file:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to save file' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
} 