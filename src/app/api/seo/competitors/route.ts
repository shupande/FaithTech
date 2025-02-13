import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const competitors = await prisma.competitorAnalysis.findMany({
      orderBy: {
        score: 'desc'
      },
      take: 5 // Limit to top 5 competitors
    })

    return NextResponse.json({
      success: true,
      data: competitors.map(competitor => ({
        name: competitor.competitor,
        score: competitor.score,
        strength: competitor.strength
      }))
    })
  } catch (error) {
    console.error('Failed to fetch competitor analysis:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch competitor analysis' },
      { status: 500 }
    )
  }
} 