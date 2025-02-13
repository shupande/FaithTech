import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个分类
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.productCategory.findUnique({
      where: { id: params.id },
      include: {
        children: {
          where: { status: 'Active' },
          orderBy: { order: 'asc' }
        },
        parent: true,
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// 更新分类
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // 如果更改了父分类，需要重新计算level
    let level = undefined
    if ('parentId' in data) {
      if (data.parentId) {
        const parent = await prisma.productCategory.findUnique({
          where: { id: data.parentId }
        })
        if (parent) {
          level = parent.level + 1
        }
      } else {
        level = 1
      }
    }

    const category = await prisma.productCategory.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(level !== undefined && { level })
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Failed to update category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// 删除分类
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 检查是否有子分类
    const hasChildren = await prisma.productCategory.count({
      where: { parentId: params.id }
    })

    if (hasChildren > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      )
    }

    // 检查是否有关联的产品
    const hasProducts = await prisma.product.count({
      where: { categoryId: params.id }
    })

    if (hasProducts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 }
      )
    }

    await prisma.productCategory.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
} 