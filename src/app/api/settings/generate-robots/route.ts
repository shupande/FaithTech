import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 获取网站的基本URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // 生成robots.txt内容
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`

    // 更新数据库中的robots.txt内容
    const existingSettings = await prisma.globalSEO.findFirst()
    
    if (existingSettings) {
      await prisma.globalSEO.update({
        where: { id: existingSettings.id },
        data: { robotsTxt }
      })
    } else {
      await prisma.globalSEO.create({
        data: {
          robotsTxt,
          description: '',
          keywords: '',
          ogImage: '',
          googleVerification: '',
          bingVerification: '',
          customMetaTags: '[]'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to generate robots.txt:', error)
    return NextResponse.json(
      { error: 'Failed to generate robots.txt' },
      { status: 500 }
    )
  }
} 