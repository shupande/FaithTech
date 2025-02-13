import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 验证schema
const settingsSchema = z.object({
  type: z.enum(["headquarters", "contact", "businessHours"]),
  data: z.string(), // JSON string
})

// GET /api/contact/settings - 获取所有设置
export async function GET() {
  try {
    const settings = await prisma.contactSettings.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching contact settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact settings" },
      { status: 500 }
    )
  }
}

// POST /api/contact/settings - 创建或更新设置
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = settingsSchema.parse(body)

    const settings = await prisma.contactSettings.upsert({
      where: {
        type: validatedData.type,
      },
      update: {
        data: validatedData.data,
      },
      create: validatedData,
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating contact settings:", error)
    return NextResponse.json(
      { error: "Failed to update contact settings" },
      { status: 500 }
    )
  }
} 