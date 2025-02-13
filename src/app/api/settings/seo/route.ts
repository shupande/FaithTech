import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 获取第一条记录，如果不存在则创建默认值
    let seoSettings = await prisma.globalSEO.findFirst()
    console.log('GET - Current SEO settings:', seoSettings)
    
    if (!seoSettings) {
      seoSettings = await prisma.globalSEO.create({
        data: {
          description: 'Your site description',
          keywords: '',
          ogImage: '',
          robotsTxt: 'User-agent: *\nAllow: /',
          googleVerification: '',
          bingVerification: '',
          customMetaTags: '[]'
        }
      })
    }

    return NextResponse.json(seoSettings)
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    console.log('PUT - Received SEO update data:', data)
    
    // 获取第一条记录的ID
    const existingSettings = await prisma.globalSEO.findFirst()
    console.log('PUT - Existing settings:', existingSettings)
    
    const id = existingSettings?.id

    if (!id) {
      return NextResponse.json(
        { error: 'SEO settings not found' },
        { status: 404 }
      )
    }

    // 更新设置
    const updatedSettings = await prisma.globalSEO.update({
      where: { id },
      data: {
        description: data.description,
        keywords: data.keywords,
        ogImage: data.ogImage,
        robotsTxt: data.robotsTxt,
        googleVerification: data.googleVerification,
        bingVerification: data.bingVerification,
        customMetaTags: data.customMetaTags
      }
    })
    
    console.log('PUT - Updated settings:', updatedSettings)

    return NextResponse.json({
      message: 'SEO settings updated successfully',
      data: updatedSettings
    })
  } catch (error) {
    console.error('Failed to update SEO settings:', error)
    return NextResponse.json(
      { error: 'Failed to update SEO settings' },
      { status: 500 }
    )
  }
} 