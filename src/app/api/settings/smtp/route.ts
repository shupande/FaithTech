import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

// GET /api/settings/smtp - 获取 SMTP 设置
export async function GET() {
  try {
    const settings = await prisma.settings.findFirst({
      where: { type: 'smtp' }
    })

    return NextResponse.json(settings || { data: null })
  } catch (error) {
    console.error("Error fetching SMTP settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch SMTP settings" },
      { status: 500 }
    )
  }
}

// POST /api/settings/smtp - 保存 SMTP 设置
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { action } = data

    // 如果是测试 SMTP 连接
    if (action === 'test') {
      const { host, port, username, password, testEmail } = data

      // 创建 SMTP 传输对象
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: {
          user: username,
          pass: password,
        },
      })

      // 验证连接配置
      await transporter.verify()

      // 如果提供了测试邮箱地址，发送测试邮件
      if (testEmail) {
        await transporter.sendMail({
          from: username,
          to: testEmail,
          subject: "SMTP Test Email",
          text: "This is a test email to verify SMTP settings.",
          html: "<p>This is a test email to verify SMTP settings.</p>",
        })
      }

      return NextResponse.json({ success: true, message: "SMTP connection test successful" })
    }

    // 否则保存 SMTP 设置
    const settings = await prisma.settings.upsert({
      where: { type: 'smtp' },
      update: { data: JSON.stringify(data) },
      create: {
        type: 'smtp',
        data: JSON.stringify(data)
      }
    })

    return NextResponse.json(settings)
  } catch (error: unknown) {
    console.error("Error in SMTP settings:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { error: "Operation failed", details: errorMessage },
      { status: 500 }
    )
  }
} 