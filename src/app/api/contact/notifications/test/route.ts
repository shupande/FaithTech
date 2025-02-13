import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Configuration ID is required" },
        { status: 400 }
      )
    }

    // 获取通知配置
    const config = await prisma.notificationConfig.findUnique({
      where: { id }
    })

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      )
    }

    // 获取 SMTP 设置
    const smtpSettings = await prisma.settings.findFirst({
      where: { type: 'smtp' }
    })

    if (!smtpSettings?.data) {
      return NextResponse.json(
        { error: "SMTP settings not found" },
        { status: 400 }
      )
    }

    const smtp = JSON.parse(smtpSettings.data)
    const emails = JSON.parse(config.emails)

    // 创建 SMTP 传输对象
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port),
      secure: Number(smtp.port) === 465,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    })

    // 发送测试邮件
    await transporter.sendMail({
      from: smtp.username,
      to: emails.join(", "),
      subject: `Test Notification - ${config.name}`,
      text: `This is a test notification for: ${config.name}\n\nType: ${config.type}\nDescription: ${config.description}`,
      html: `
        <h2>Test Notification</h2>
        <p>This is a test notification for: <strong>${config.name}</strong></p>
        <p><strong>Type:</strong> ${config.type}</p>
        <p><strong>Description:</strong> ${config.description}</p>
        <hr>
        <p><em>This is a test email sent from your notification system.</em></p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending test notification:", error)
    return NextResponse.json(
      { error: "Failed to send test notification", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 