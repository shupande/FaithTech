import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"

const updatePageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  status: z.enum(['Draft', 'Published', 'Archived']),
  content: z.string().min(1, 'Content is required'),
  hero: z.object({
    badge: z.object({
      text: z.string(),
      action: z.object({
        text: z.string(),
        href: z.string(),
      }),
    }).optional(),
    title: z.string(),
    description: z.string(),
    actions: z.array(z.object({
      text: z.string(),
      href: z.string(),
      variant: z.enum(["default", "glow"]).optional(),
    })),
    image: z.object({
      light: z.string(),
      dark: z.string(),
      alt: z.string(),
    }),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log('[PAGE_GET] Fetching page with ID:', params.id)
  
  try {
    if (!params.id) {
      console.error('[PAGE_GET] No ID provided')
      return NextResponse.json({
        success: false,
        message: 'No page ID provided'
      }, { status: 400 })
    }

    const page = await prisma.page.findUnique({
      where: { id: params.id }
    })

    console.log('[PAGE_GET] Database query result:', page)

    if (!page) {
      console.log('[PAGE_GET] Page not found for ID:', params.id)
      return NextResponse.json({
        success: false,
        message: `Page not found with ID: ${params.id}`
      }, { status: 404 })
    }

    // Parse JSON fields safely
    let heroData = null
    let seoData = null

    try {
      if (page.hero) {
        heroData = JSON.parse(page.hero)
        console.log('[PAGE_GET] Parsed hero data:', heroData)
      }
      if (page.seo) {
        seoData = JSON.parse(page.seo)
        console.log('[PAGE_GET] Parsed SEO data:', seoData)
      }
    } catch (parseError) {
      console.error('[PAGE_GET] Error parsing JSON fields:', parseError)
    }

    const responseData = {
      success: true,
      data: {
        ...page,
        hero: heroData,
        seo: seoData,
      }
    }

    console.log('[PAGE_GET] Sending response:', responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[PAGE_GET] Error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const data = updatePageSchema.parse(body)

    // 检查 slug 是否已被其他页面使用
    if (data.slug) {
      const existingPage = await prisma.page.findFirst({
        where: {
          slug: data.slug,
          NOT: {
            id: params.id
          }
        }
      })

      if (existingPage) {
        return NextResponse.json({
          success: false,
          message: 'Slug already exists'
        }, { status: 400 })
      }
    }

    const page = await prisma.page.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        status: data.status,
        content: data.content,
        hero: data.hero ? JSON.stringify(data.hero) : null,
        seo: data.seo ? JSON.stringify(data.seo) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        hero: data.hero || null,
        seo: data.seo || null,
      }
    })
  } catch (error) {
    console.error('[PAGE_PUT]', error)
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.page.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })
  } catch (error) {
    console.error('[PAGE_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 