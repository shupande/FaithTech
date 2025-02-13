import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Active', 'Draft']).optional(),
})

// GET /api/faq
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
            { question: { contains: query.search } },
            { answer: { contains: query.search } },
          ],
        } : {},
        // 分类过滤
        query.category ? { category: query.category } : {},
        // 状态过滤
        query.status ? { status: query.status } : {},
      ],
    }

    // 获取总数
    const total = await prisma.fAQ.count({ where })

    // 获取分页数据
    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: (query.page - 1) * query.perPage,
      take: query.perPage,
    })

    return NextResponse.json({
      success: true,
      data: faqs,
      pagination: {
        page: query.page,
        perPage: query.perPage,
        total,
        totalPages: Math.ceil(total / query.perPage),
      }
    })
  } catch (error) {
    console.error('[FAQ_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const createFAQSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().optional(),
  order: z.number().min(0).default(0),
  status: z.enum(['Active', 'Draft']).default('Active'),
})

// POST /api/faq
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createFAQSchema.parse(body)

    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
        status: data.status,
      }
    })

    return NextResponse.json({
      success: true,
      data: faq
    })
  } catch (error) {
    console.error('[FAQ_POST]', error)
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