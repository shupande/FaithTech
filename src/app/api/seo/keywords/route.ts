import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const keywords = await prisma.keywordRanking.findMany({
      orderBy: {
        position: 'asc'
      },
      take: 10 // Limit to top 10 keywords
    })

    return NextResponse.json({
      success: true,
      data: keywords.map(keyword => ({
        keyword: keyword.keyword,
        position: keyword.position,
        change: keyword.change
      }))
    })
  } catch (error) {
    console.error('Failed to fetch keyword rankings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch keyword rankings' },
      { status: 500 }
    )
  }
} 