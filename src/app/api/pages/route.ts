import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']).optional(),
})

// GET /api/pages
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
            { content: { contains: query.search } },
          ],
        } : {},
        // 状态过滤
        query.status ? { status: query.status } : {},
      ],
    }

    // 获取总数
    const total = await prisma.page.count({ where })

    // 获取分页数据
    const pages = await prisma.page.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
    })

    return NextResponse.json({
      success: true,
      data: pages.map(page => ({
        ...page,
        seo: page.seo ? JSON.parse(page.seo) : null,
      })),
      pagination: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages: Math.ceil(total / query.perPage),
      }
    })
  } catch (error) {
    console.error('[PAGES_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const createPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  content: z.string().min(1, 'Content is required'),
  hero: z.object({
    badge: z.object({
      text: z.string(),
      action: z.object({
        text: z.string(),
        href: z.string(),
      }),
    }).optional(),
    title: z.string(),
    description: z.string(),
    actions: z.array(z.object({
      text: z.string(),
      href: z.string(),
      variant: z.enum(["default", "glow"]).optional(),
    })),
    image: z.object({
      light: z.string(),
      dark: z.string(),
      alt: z.string(),
    }),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }).optional(),
})

// POST /api/pages
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createPageSchema.parse(body)

    // 检查 slug 是否已存在
    const existingPage = await prisma.page.findUnique({
      where: { slug: data.slug }
    })

    if (existingPage) {
      return NextResponse.json({
        success: false,
        message: 'Slug already exists'
      }, { status: 400 })
    }

    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        status: data.status,
        content: data.content,
        hero: data.hero ? JSON.stringify(data.hero) : null,
        seo: data.seo ? JSON.stringify(data.seo) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        hero: data.hero || null,
        seo: data.seo || null,
      }
    })
  } catch (error) {
    console.error('[PAGES_POST]', error)
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