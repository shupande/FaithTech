import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoSettings = await prisma.globalSEO.findFirst()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'

  // 如果有自定义的 robots.txt 内容，直接返回
  if (seoSettings?.robotsTxt) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    }
  }

  // 默认的 robots.txt 配置
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 