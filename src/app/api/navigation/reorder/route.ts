import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    order: z.number(),
    parentId: z.string().nullable(),
  })),
})

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { items } = reorderSchema.parse(body)

    // 使用事务确保所有更新都成功或都失败
    await prisma.$transaction(
      items.map(item => 
        prisma.navigationItem.update({
          where: { id: item.id },
          data: {
            order: item.order,
            parentId: item.parentId,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Navigation items reordered successfully',
    })
  } catch (error) {
    console.error('[NAVIGATION_REORDER]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      }, { status: 400 })
    }
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
    }, { status: 500 })
  }
} 