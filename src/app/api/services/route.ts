import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Active', 'Draft', 'Archived']).optional(),
})

// GET /api/services
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    // 构建查询条件
    const where = {
      AND: [
        // 搜索条件
        query.search ? {
          OR: [
            { title: { contains: query.search } },
            { slug: { contains: query.search } },
            { description: { contains: query.search } },
          ],
        } : {},
        // 分类过滤
        query.category ? { category: query.category } : {},
        // 状态过滤
        query.status ? { status: query.status } : {},
      ],
    }

    // 获取总数
    const total = await prisma.service.count({ where })

    // 获取分页数据
    const services = await prisma.service.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
    })

    return NextResponse.json({
      success: true,
      data: services.map(service => ({
        ...service,
        icon: service.icon ? JSON.parse(service.icon) : null,
        features: service.features ? JSON.parse(service.features) : [],
      })),
      pagination: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages: Math.ceil(total / query.perPage),
      }
    })
  } catch (error) {
    console.error('[SERVICES_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const createServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['Active', 'Draft', 'Archived']),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  icon: z.object({
    type: z.string(),
    value: z.string(),
  }).optional(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  })).optional(),
})

// POST /api/services
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createServiceSchema.parse(body)

    // 检查 slug 是否已存在
    const existingService = await prisma.service.findUnique({
      where: { slug: data.slug }
    })

    if (existingService) {
      return NextResponse.json({
        success: false,
        message: 'Slug already exists'
      }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        status: data.status,
        description: data.description,
        content: data.content,
        icon: data.icon ? JSON.stringify(data.icon) : null,
        features: data.features ? JSON.stringify(data.features) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        icon: data.icon,
        features: data.features || [],
      }
    })
  } catch (error) {
    console.error('[SERVICES_POST]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 })
    }
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 