import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"
import { NavigationItemType } from '@/lib/api/types'

const querySchema = z.object({
  type: z.enum(['header', 'footer']),
  parentId: z.string().optional(),
})

const createSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().min(1, 'URL is required'),
  type: z.enum(['header', 'footer']),
  active: z.boolean().optional().default(true),
  order: z.number(),
  parentId: z.string().optional(),
})

// Helper function to build navigation tree
async function buildNavigationTree(items: any[], parentId: string | null = null): Promise<NavigationItemType[]> {
  const children = items.filter(item => item.parentId === parentId);
  const sortedChildren = children.sort((a, b) => a.order - b.order);
  
  const result = await Promise.all(
    sortedChildren.map(async (child) => ({
      ...child,
      children: await buildNavigationTree(items, child.id)
    }))
  );

  return result;
}

// GET /api/navigation
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      type: searchParams.get('type') || 'header',
      parentId: searchParams.get('parentId') || undefined,
    })

    const items = await prisma.navigationItem.findMany({
      where: {
        type: query.type,
        parentId: query.parentId,
      },
    })

    const tree = await buildNavigationTree(items);

    return NextResponse.json({
      success: true,
      data: tree,
    })
  } catch (error) {
    console.error('[NAVIGATION_GET]', error)
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

// POST /api/navigation
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = createSchema.parse(body)

    // Get max order for the current level and type
    const maxOrder = await prisma.navigationItem.findFirst({
      where: {
        type: validatedData.type,
        parentId: validatedData.parentId || null,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true,
      },
    })

    const item = await prisma.navigationItem.create({
      data: {
        label: validatedData.label,
        url: validatedData.url,
        type: validatedData.type,
        active: validatedData.active,
        order: maxOrder ? maxOrder.order + 1 : 0,
        parentId: validatedData.parentId,
      },
    })

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error('[NAVIGATION_POST]', error)
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

// PATCH /api/navigation/reorder
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const items = z.array(z.object({
      id: z.string(),
      order: z.number(),
      parentId: z.string().nullable(),
    })).parse(body.items)

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
    })
  } catch (error) {
    console.error('[NAVIGATION_REORDER]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
    }, { status: 500 })
  }
} 