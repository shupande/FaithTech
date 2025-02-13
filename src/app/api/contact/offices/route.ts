import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 验证schema
const officeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  status: z.boolean().default(true),
})

// GET /api/contact/offices - 获取所有办公室
export async function GET() {
  try {
    const offices = await prisma.globalOffice.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(offices)
  } catch (error) {
    console.error("Error fetching offices:", error)
    return NextResponse.json(
      { error: "Failed to fetch offices" },
      { status: 500 }
    )
  }
}

// POST /api/contact/offices - 创建新办公室
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = officeSchema.parse(body)

    const office = await prisma.globalOffice.create({
      data: validatedData,
    })

    return NextResponse.json(office, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating office:", error)
    return NextResponse.json(
      { error: "Failed to create office" },
      { status: 500 }
    )
  }
}

// PATCH /api/contact/offices - 更新办公室
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: "Office ID is required" },
        { status: 400 }
      )
    }

    const validatedData = officeSchema.parse(data)

    const office = await prisma.globalOffice.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(office)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating office:", error)
    return NextResponse.json(
      { error: "Failed to update office" },
      { status: 500 }
    )
  }
}

// DELETE /api/contact/offices - 删除办公室
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Office ID is required" },
        { status: 400 }
      )
    }

    await prisma.globalOffice.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting office:", error)
    return NextResponse.json(
      { error: "Failed to delete office" },
      { status: 500 }
    )
  }
} 