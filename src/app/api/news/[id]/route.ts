import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiConfig } from "../../config"

export const { runtime, dynamic } = apiConfig

// GET /api/news/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id }
    })

    if (!news) {
      return NextResponse.json({
        success: false,
        message: "News not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...news,
        coverImage: news.coverImage ? JSON.parse(news.coverImage) : null,
        attachments: news.attachments ? JSON.parse(news.attachments) : [],
      }
    })
  } catch (error) {
    console.error('[NEWS_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

// PUT /api/news/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        category: body.category,
        status: body.status,
        publishDate: new Date(body.publishDate),
        content: body.content,
        coverImage: body.coverImage ? JSON.stringify(body.coverImage) : null,
        attachments: body.attachments ? JSON.stringify(body.attachments) : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...news,
        coverImage: news.coverImage ? JSON.parse(news.coverImage) : null,
        attachments: news.attachments ? JSON.parse(news.attachments) : [],
      }
    })
  } catch (error) {
    console.error('[NEWS_PUT]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

// DELETE /api/news/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: "News deleted successfully"
    })
  } catch (error) {
    console.error('[NEWS_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 