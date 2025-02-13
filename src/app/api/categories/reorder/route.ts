import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { categories } = await request.json()
    
    // 批量更新分类顺序
    await Promise.all(
      categories.map((category: { id: string; order: number }) =>
        prisma.productCategory.update({
          where: { id: category.id },
          data: { order: category.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reorder categories:', error)
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    )
  }
} 