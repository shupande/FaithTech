import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// 验证创建分类的请求
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

// 验证更新分类的请求
const updateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['Active', 'Archived']).optional(),
})

// GET /api/media/categories
export async function GET(req: Request) {
  try {
    const categories = await prisma.mediaCategory.findMany({
      where: {
        status: 'Active',
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Failed to fetch media categories:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch media categories' },
      { status: 500 }
    )
  }
}

// POST /api/media/categories
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = createCategorySchema.parse(body)

    // 检查名称是否已存在
    const existingCategory = await prisma.mediaCategory.findFirst({
      where: {
        name: validatedData.name,
        status: 'Active',
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category name already exists' },
        { status: 400 }
      )
    }

    // 如果指定了父分类，检查其是否存在
    if (validatedData.parentId) {
      const parentCategory = await prisma.mediaCategory.findUnique({
        where: { id: validatedData.parentId },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { success: false, message: 'Parent category not found' },
          { status: 404 }
        )
      }
    }

    // 创建分类
    const category = await prisma.mediaCategory.create({
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Failed to create media category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create media category' },
      { status: 500 }
    )
  }
}

// PUT /api/media/categories
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = updateCategorySchema.parse(body)

    // 检查分类是否存在
    const existingCategory = await prisma.mediaCategory.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    // 如果更新名称，检查新名称是否已存在
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const duplicateCategory = await prisma.mediaCategory.findFirst({
        where: {
          name: validatedData.name,
          status: 'Active',
          id: { not: id },
        },
      })

      if (duplicateCategory) {
        return NextResponse.json(
          { success: false, message: 'Category name already exists' },
          { status: 400 }
        )
      }
    }

    // 如果指定了父分类，检查其是否存在且不是自身
    if (validatedData.parentId) {
      if (validatedData.parentId === id) {
        return NextResponse.json(
          { success: false, message: 'Category cannot be its own parent' },
          { status: 400 }
        )
      }

      const parentCategory = await prisma.mediaCategory.findUnique({
        where: { id: validatedData.parentId },
      })

      if (!parentCategory) {
        return NextResponse.json(
          { success: false, message: 'Parent category not found' },
          { status: 404 }
        )
      }
    }

    // 更新分类
    const category = await prisma.mediaCategory.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Failed to update media category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update media category' },
      { status: 500 }
    )
  }
}

// DELETE /api/media/categories
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      )
    }

    // 检查分类是否存在
    const category = await prisma.mediaCategory.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    // 检查是否有子分类
    const hasChildren = await prisma.mediaCategory.findFirst({
      where: {
        parentId: id,
        status: 'Active',
      },
    })

    if (hasChildren) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with active sub-categories' },
        { status: 400 }
      )
    }

    // 检查是否有使用此分类的资产
    const hasAssets = await prisma.mediaAsset.findFirst({
      where: {
        category: category.name,
        status: 'Active',
      },
    })

    if (hasAssets) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with active assets' },
        { status: 400 }
      )
    }

    // 软删除分类
    await prisma.mediaCategory.update({
      where: { id },
      data: {
        status: 'Archived',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Category archived successfully',
    })
  } catch (error) {
    console.error('Failed to delete media category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete media category' },
      { status: 500 }
    )
  }
} 