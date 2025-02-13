import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 获取网站的基本URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // 获取所有活跃的内容
    const [products, news, solutions, services, pages] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'Active' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.news.findMany({
        where: { status: 'Published' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.solution.findMany({
        where: { status: 'Active' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.service.findMany({
        where: { status: 'Active' },
        select: { slug: true, updatedAt: true }
      }),
      prisma.page.findMany({
        where: { status: 'Published' },
        select: { slug: true, updatedAt: true }
      })
    ])

    // 生成sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${products.map(item => `
  <url>
    <loc>${baseUrl}/products/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${news.map(item => `
  <url>
    <loc>${baseUrl}/news/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${solutions.map(item => `
  <url>
    <loc>${baseUrl}/solutions/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${services.map(item => `
  <url>
    <loc>${baseUrl}/services/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${pages.map(item => `
  <url>
    <loc>${baseUrl}/${item.slug}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    // 将sitemap写入到public目录
    const fs = require('fs')
    const path = require('path')
    const publicPath = path.join(process.cwd(), 'public')
    
    // 确保public目录存在
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true })
    }
    
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to generate sitemap.xml:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap.xml' },
      { status: 500 }
    )
  }
} 