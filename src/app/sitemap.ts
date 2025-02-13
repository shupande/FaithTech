import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3001'

  // 获取所有发布的页面
  const pages = await prisma.page.findMany({
    where: {
      status: 'Published'
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // 获取所有发布的产品
  const products = await prisma.product.findMany({
    where: {
      status: 'Active'
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // 获取所有发布的新闻
  const news = await prisma.news.findMany({
    where: {
      status: 'Published'
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // 获取所有发布的解决方案
  const solutions = await prisma.solution.findMany({
    where: {
      status: 'Active'
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // 获取所有发布的服务
  const services = await prisma.service.findMany({
    where: {
      status: 'Active'
    },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  // 基础路由
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // 添加动态页面到站点地图
  return [
    ...routes,
    // 添加页面
    ...pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // 添加产品
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // 添加新闻
    ...news.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    // 添加解决方案
    ...solutions.map((solution) => ({
      url: `${baseUrl}/solutions/${solution.slug}`,
      lastModified: solution.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // 添加服务
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
} 