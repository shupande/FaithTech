import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CategoryWithRelations {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  image?: string | null
  status: string
  order: number
  level: number
  parentId?: string | null
  children?: CategoryWithRelations[]
  products: { id: string }[]
  createdAt: Date
  updatedAt: Date
}

interface ProcessedCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  image?: string | null
  status: string
  order: number
  level: number
  parentId?: string | null
  children: ProcessedCategory[]
  _count: {
    products: number
  }
  products?: { id: string }[]
}

// 获取分类列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const includeProducts = searchParams.get('includeProducts') === 'true'

    // 获取所有分类及其关联数据
    const categories = await prisma.productCategory.findMany({
      where: {
        ...(parentId ? { parentId } : { level: 1 }),
        ...(includeInactive ? {} : { status: 'Active' })
      },
      include: {
        children: {
          where: includeInactive ? {} : { status: 'Active' },
          include: {
            products: {
              where: { status: 'Active' },
              select: { id: true }
            }
          },
          orderBy: { order: 'asc' }
        },
        products: {
          where: { status: 'Active' },
          select: { id: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    // 处理分类数据，计算包含子分类的产品总数
    const processedCategories = categories.map(category => {
      // 计算当前分类的直接产品数量
      const directProducts = category.products.length
      
      // 计算所有子分类的产品数量
      const childrenProducts = category.children.reduce((sum, child) => 
        sum + child.products.length, 0)
      
      // 返回处理后的分类数据
      return {
        ...category,
        _count: {
          products: directProducts + childrenProducts
        },
        // 如果不需要返回产品列表，则删除products字段
        ...(includeProducts ? {} : { products: undefined })
      }
    })

    return NextResponse.json(processedCategories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 如果有parentId，计算正确的level
    let level = 1
    if (data.parentId) {
      const parent = await prisma.productCategory.findUnique({
        where: { id: data.parentId }
      })
      if (parent) {
        level = parent.level + 1
      }
    }

    // 生成slug
    const slug = data.slug || data.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 获取同级分类的最大order
    const maxOrder = await prisma.productCategory.aggregate({
      where: { parentId: data.parentId || null },
      _max: { order: true }
    })

    const category = await prisma.productCategory.create({
      data: {
        ...data,
        slug,
        level,
        order: (maxOrder._max.order || 0) + 1
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 