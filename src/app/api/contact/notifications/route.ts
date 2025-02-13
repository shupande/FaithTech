import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 验证schema
const notificationConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  emails: z.string(), // JSON string array
  enabled: z.boolean().default(true),
})

// GET /api/contact/notifications - 获取所有通知配置
export async function GET() {
  try {
    const configs = await prisma.notificationConfig.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(configs)
  } catch (error) {
    console.error("Error fetching notification configs:", error)
    return NextResponse.json(
      { error: "Failed to fetch notification configs" },
      { status: 500 }
    )
  }
}

// POST /api/contact/notifications - 创建新通知配置
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = notificationConfigSchema.parse(body)

    const config = await prisma.notificationConfig.create({
      data: validatedData,
    })

    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating notification config:", error)
    return NextResponse.json(
      { error: "Failed to create notification config" },
      { status: 500 }
    )
  }
}

// PATCH /api/contact/notifications - 更新通知配置
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: "Config ID is required" },
        { status: 400 }
      )
    }

    const validatedData = notificationConfigSchema.parse(data)

    const config = await prisma.notificationConfig.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating notification config:", error)
    return NextResponse.json(
      { error: "Failed to update notification config" },
      { status: 500 }
    )
  }
}

// DELETE /api/contact/notifications - 删除通知配置
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Config ID is required" },
        { status: 400 }
      )
    }

    await prisma.notificationConfig.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notification config:", error)
    return NextResponse.json(
      { error: "Failed to delete notification config" },
      { status: 500 }
    )
  }
} 