import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

// GET /api/faq/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "FAQ ID required"
      }, { status: 400 })
    }

    const faq = await prisma.fAQ.findUnique({
      where: { id: params.id }
    })

    if (!faq) {
      return NextResponse.json({
        success: false,
        message: "FAQ not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: faq
    })
  } catch (error) {
    console.error('[FAQ_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const updateFAQSchema = z.object({
  question: z.string().min(1, 'Question is required').optional(),
  answer: z.string().min(1, 'Answer is required').optional(),
  category: z.string().optional(),
  order: z.number().min(0).optional(),
  status: z.enum(['Active', 'Draft']).optional(),
})

// PUT /api/faq/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "FAQ ID required"
      }, { status: 400 })
    }

    const body = await req.json()
    const data = updateFAQSchema.parse(body)

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: params.id }
    })

    if (!existingFAQ) {
      return NextResponse.json({
        success: false,
        message: "FAQ not found"
      }, { status: 404 })
    }

    const faq = await prisma.fAQ.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json({
      success: true,
      data: faq
    })
  } catch (error) {
    console.error('[FAQ_PUT]', error)
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

// DELETE /api/faq/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "FAQ ID required"
      }, { status: 400 })
    }

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: params.id }
    })

    if (!existingFAQ) {
      return NextResponse.json({
        success: false,
        message: "FAQ not found"
      }, { status: 404 })
    }

    await prisma.fAQ.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    })
  } catch (error) {
    console.error('[FAQ_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 