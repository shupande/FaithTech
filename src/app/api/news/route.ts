import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiConfig } from "../config"

export const { runtime, dynamic } = apiConfig

// GET /api/news
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishDate: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: news.map(item => ({
        ...item,
        coverImage: item.coverImage ? JSON.parse(item.coverImage) : null,
        attachments: item.attachments ? JSON.parse(item.attachments) : [],
      }))
    })
  } catch (error) {
    console.error('[NEWS_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

// POST /api/news
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const news = await prisma.news.create({
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
    console.error('[NEWS_POST]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 