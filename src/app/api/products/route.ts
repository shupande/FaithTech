import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"
import type { Product as PrismaProduct } from '@prisma/client'

// 定义产品接口以匹配前端期望的数据结构
interface ProductImage {
  url: string
  alt: string
}

interface ProductFile {
  name: string
  url: string
  size: number
}

interface ProductResponse {
  id: string
  name: string
  slug: string
  categoryId: string
  status: 'Active' | 'Coming Soon' | 'Discontinued'
  description: string
  features: string
  specifications: string
  models: string
  images: string[]
  files: ProductFile[]
  createdAt: Date
  updatedAt: Date
}

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']).optional(),
})

// 递归获取所有子分类ID
async function getAllChildCategoryIds(categoryId: string): Promise<string[]> {
  const categories = await prisma.productCategory.findMany({
    where: { parentId: categoryId },
    select: { id: true }
  })
  
  const childIds = categories.map(c => c.id)
  const descendantIds = await Promise.all(
    childIds.map(id => getAllChildCategoryIds(id))
  )
  
  return [categoryId, ...childIds, ...descendantIds.flat()]
}

// GET /api/products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    
    // 构建查询条件
    const where: any = {}
    
    // 搜索条件
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { slug: { contains: query.search } },
        { description: { contains: query.search } },
      ]
    }
    
    // 分类过滤（包含子分类）
    if (query.category && query.category !== 'all') {
      const categoryIds = await getAllChildCategoryIds(query.category)
      where.categoryId = { in: categoryIds }
    }
    
    // 状态过滤
    if (query.status) {
      where.status = query.status
    }

    // 获取总数
    const total = await prisma.product.count({ where })

    // 获取分页数据
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: ((Number(query.page) || 1) - 1) * (Number(query.perPage) || 10),
      take: Number(query.perPage) || 10,
    })

    // 转换数据格式以匹配前端期望
    const formattedProducts = products.map(product => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
      let images: string[] = []
      
      try {
        if (product.images) {
          const parsedImages = JSON.parse(product.images)
          images = Array.isArray(parsedImages) ? parsedImages.map((img: string) => {
            if (img.startsWith('http') || (baseUrl && img.startsWith(baseUrl))) {
              return img
            }
            return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
          }) : []
        }
      } catch (e) {
        console.error('Error parsing images:', e)
      }

      return {
        ...product,
        images,
        files: product.files ? JSON.parse(product.files) : [],
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page: Number(query.page) || 1,
        perPage: Number(query.perPage) || 10,
        total,
        totalPages: Math.ceil(total / (Number(query.perPage) || 10)),
      }
    })
  } catch (error) {
    console.error('[PRODUCTS_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']),
  description: z.string().min(1, 'Description is required'),
  features: z.string(),
  specifications: z.string(),
  models: z.string(),
  images: z.string(),
  files: z.string(),
})

// POST /api/products
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('[PRODUCT_CREATE_REQUEST]', body)
    
    const data = createProductSchema.parse(body)

    // 检查 slug 是否已存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug }
    })

    if (existingProduct) {
      return NextResponse.json({
        success: false,
        message: 'Slug already exists'
      }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        status: data.status,
        description: data.description,
        features: data.features,
        specifications: data.specifications,
        models: data.models,
        images: data.images,
        files: data.files,
      }
    })

    console.log('[PRODUCT_CREATED]', product)

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
        files: product.files ? JSON.parse(product.files) : [],
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }
    })
  } catch (error) {
    console.error('[PRODUCTS_POST]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 })
    }
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
      error: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  features: z.string().optional(),
  specifications: z.string().optional(),
  models: z.string().optional(),
  images: z.string().optional(),
  files: z.string().optional(),
})

// PUT /api/products
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug is required'
      }, { status: 400 })
    }

    const body = await req.json()
    console.log('[PRODUCT_UPDATE_REQUEST]', { slug, body })
    
    const data = updateProductSchema.parse(body)

    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 })
    }

    // 更新产品
    const product = await prisma.product.update({
      where: { slug },
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : undefined,
        files: data.files ? JSON.stringify(data.files) : undefined,
      }
    })

    console.log('[PRODUCT_UPDATED]', product)

    const formattedProduct: ProductResponse = {
      ...product,
      images: data.images || JSON.parse(product.images || '[]'),
      files: data.files || JSON.parse(product.files || '[]'),
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }

    return NextResponse.json({
      success: true,
      data: formattedProduct
    })
  } catch (error) {
    console.error('[PRODUCTS_PUT]', error)
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

// DELETE /api/products
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug is required'
      }, { status: 400 })
    }

    console.log('[PRODUCT_DELETE_REQUEST]', { slug })

    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 })
    }

    // 软删除：将状态更新为 'Discontinued'
    const product = await prisma.product.update({
      where: { slug },
      data: {
        status: 'Discontinued'
      }
    })

    console.log('[PRODUCT_DELETED]', product)

    return NextResponse.json({
      success: true,
      message: 'Product discontinued successfully'
    })
  } catch (error) {
    console.error('[PRODUCTS_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 