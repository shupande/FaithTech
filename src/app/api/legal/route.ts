import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 验证schema
const legalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.string().min(1, "Type is required"),
  content: z.string().min(1, "Content is required"),
  version: z.string().min(1, "Version is required"),
  effectiveDate: z.string().transform(str => new Date(str)),
  status: z.string().default("Active")
})

// GET /api/legal - 获取文档
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")
    const slug = searchParams.get("slug")
    const status = searchParams.get("status")

    // 构建查询条件
    let where: any = {}
    if (id) where.id = id
    if (type) where.type = type
    if (slug) where.slug = slug
    if (status) where.status = status

    // 如果有 ID，返回单个文档
    if (id) {
      const document = await prisma.legal.findUnique({
        where: { id }
      })
      
      if (!document) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json(document)
    }

    // 如果同时有 type 和 slug，返回单个文档
    if (type && slug) {
      const document = await prisma.legal.findFirst({
        where: { type, slug }
      })
      
      if (!document) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        )
      }
      
      return NextResponse.json(document)
    }

    // 获取文档列表，支持分页
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [documents, total] = await Promise.all([
      prisma.legal.findMany({
        where,
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.legal.count({ where })
    ])

    // 返回文档列表和分页信息
    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}

// POST /api/legal - 创建新文档
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Received request body:", body)

    const validatedData = legalSchema.parse(body)
    console.log("Validated data:", validatedData)

    // 检查 slug 唯一性
    const existing = await prisma.legal.findFirst({
      where: { 
        slug: validatedData.slug,
        type: validatedData.type // 同类型下 slug 唯一
      }
    })

    if (existing) {
      console.log("Found existing document with same slug and type:", existing)
      return NextResponse.json(
        { error: "A document with this slug already exists for this type" },
        { status: 400 }
      )
    }

    // 确保日期格式正确
    const formattedData = {
      ...validatedData,
      effectiveDate: new Date(validatedData.effectiveDate)
    }

    console.log("Attempting to create document with data:", formattedData)

    const document = await prisma.legal.create({
      data: formattedData,
    })

    console.log("Document created successfully:", document)
    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Detailed error in POST /api/legal:", error)

    if (error instanceof z.ZodError) {
      console.log("Validation error details:", error.errors)
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    // 检查是否是 Prisma 错误
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      console.error("Prisma error:", error)
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Failed to create document",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PATCH /api/legal - 更新文档
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const body = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }

    const validatedData = legalSchema.parse(body)

    // 检查 slug 唯一性（同类型下）
    const existing = await prisma.legal.findFirst({
      where: {
        slug: validatedData.slug,
        type: validatedData.type,
        NOT: { id }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "A document with this slug already exists for this type" },
        { status: 400 }
      )
    }

    const document = await prisma.legal.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(document)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating document:", error)
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    )
  }
}

// DELETE /api/legal - 删除文档
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }

    await prisma.legal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    )
  }
}

// GET /api/legal/types - 获取所有文档类型
export async function getTypes() {
  try {
    const types = await prisma.legal.groupBy({
      by: ['type'],
      _count: {
        type: true
      }
    })

    return NextResponse.json(types.map(t => ({
      type: t.type,
      count: t._count.type
    })))
  } catch (error) {
    console.error("Error fetching document types:", error)
    return NextResponse.json(
      { error: "Failed to fetch document types" },
      { status: 500 }
    )
  }
} 