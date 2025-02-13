import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const smtpSettings = await prisma.settings.findFirst({
      where: { type: 'smtp' }
    })

    if (!smtpSettings?.data) {
      return NextResponse.json(
        { 
          configured: false,
          message: "SMTP settings not found" 
        }
      )
    }

    const data = JSON.parse(smtpSettings.data)
    const isConfigured = !!(data.host && data.port && data.username && data.password)

    return NextResponse.json({
      configured: isConfigured,
      message: isConfigured ? "SMTP is configured" : "SMTP configuration is incomplete"
    })
  } catch (error) {
    console.error("Error checking SMTP status:", error)
    return NextResponse.json(
      { 
        configured: false,
        message: "Failed to check SMTP status" 
      },
      { status: 500 }
    )
  }
} 