import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const updateSchema = z.object({
  label: z.string().min(1, 'Label is required').optional(),
  url: z.string().min(1, 'URL is required').optional(),
  type: z.enum(['header', 'footer']).optional(),
  active: z.boolean().optional(),
  order: z.number().optional(),
  parentId: z.string().nullable().optional(),
})

// PUT /api/navigation/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await req.json()
    console.log('Update body:', body) // 添加日志
    const validatedData = updateSchema.parse(body)

    // First get the existing item to preserve the type
    const existingItem = await prisma.navigationItem.findUnique({
      where: { id },
    })

    if (!existingItem) {
      return NextResponse.json({
        success: false,
        message: 'Navigation item not found',
      }, { status: 404 })
    }

    const updateData = {
      ...(validatedData.label !== undefined && { label: validatedData.label }),
      ...(validatedData.url !== undefined && { url: validatedData.url }),
      ...(validatedData.type !== undefined && { type: validatedData.type }),
      ...(validatedData.active !== undefined && { active: validatedData.active }),
      ...(validatedData.order !== undefined && { order: validatedData.order }),
      ...(validatedData.parentId !== undefined && { parentId: validatedData.parentId }),
    }

    const item = await prisma.navigationItem.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error('[NAVIGATION_PUT]', error)
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

// DELETE /api/navigation/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    if (!id) throw new Error('ID is required')

    await prisma.navigationItem.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('[NAVIGATION_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
    }, { status: 500 })
  }
} 