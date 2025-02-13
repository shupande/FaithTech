import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import nodemailer from "nodemailer"

// 验证schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  attachments: z.array(z.string()).optional(),
})

// 发送通知邮件
async function sendNotificationEmails(formData: any) {
  try {
    console.log("Starting to send notification email...")

    // 获取 SMTP 设置
    const smtpSettings = await prisma.settings.findFirst({
      where: { type: 'smtp' }
    })

    if (!smtpSettings?.data) {
      console.error("SMTP settings not found")
      return
    }
    console.log("SMTP settings found:", { type: smtpSettings.type })

    // 获取通知配置
    const notificationConfig = await prisma.notificationConfig.findFirst({
      where: {
        type: 'new_contact',
        enabled: true
      }
    })

    if (!notificationConfig) {
      console.error("No active notification configuration found for new contacts")
      return
    }
    console.log("Notification config found:", { 
      type: notificationConfig.type, 
      name: notificationConfig.name,
      enabled: notificationConfig.enabled 
    })

    const smtp = JSON.parse(smtpSettings.data)
    const recipients = JSON.parse(notificationConfig.emails)
    
    console.log("Preparing to send email to recipients:", recipients)

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

    // 验证 SMTP 连接
    await transporter.verify()
    console.log("SMTP connection verified successfully")

    // 发送通知邮件
    const mailResult = await transporter.sendMail({
      from: smtp.username,
      to: recipients.join(", "),
      subject: `New Contact Form Submission: ${formData.subject}`,
      text: `
New contact form submission received:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company}
Subject: ${formData.subject}

Message:
${formData.message}

Attachments: ${formData.attachments ? 'Yes' : 'No'}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.firstName} ${formData.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.company}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.subject}</td>
          </tr>
        </table>
        <h3 style="margin-top: 20px;">Message:</h3>
        <p style="white-space: pre-wrap;">${formData.message}</p>
        ${formData.attachments ? '<p><strong>Attachments:</strong> Yes</p>' : ''}
      `,
    })

    console.log("Email sent successfully:", mailResult)
  } catch (error) {
    console.error("Error sending notification email:", error)
    // 抛出错误以便上层捕获
    throw error
  }
}

// GET /api/contact/form - 获取联系表单列表
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    let where: any = {}

    // 添加过滤条件
    if (status && status !== "all") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ]
    }

    if (fromDate || toDate) {
      where.createdAt = {}
      if (fromDate) where.createdAt.gte = new Date(fromDate)
      if (toDate) where.createdAt.lte = new Date(toDate)
    }

    const forms = await prisma.contactForm.findMany({
      where,
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error fetching contact forms:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact forms" },
      { status: 500 }
    )
  }
}

// POST /api/contact/form - 提交新的联系表单
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = contactFormSchema.parse(body)

    // 先创建联系表单记录
    const form = await prisma.contactForm.create({
      data: {
        ...validatedData,
        attachments: validatedData.attachments ? JSON.stringify(validatedData.attachments) : null,
      },
    })

    try {
      // 尝试发送通知邮件
      await sendNotificationEmails(validatedData)
      console.log("Notification email sent successfully")
    } catch (emailError) {
      // 如果发送邮件失败，记录错误但不影响表单提交
      console.error("Failed to send notification email:", emailError)
      // 可以选择更新表单记录以标记邮件发送失败
      await prisma.contactForm.update({
        where: { id: form.id },
        data: {
          notes: `Email notification failed: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`
        }
      })
    }

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating contact form:", error)
    return NextResponse.json(
      { error: "Failed to create contact form" },
      { status: 500 }
    )
  }
}

// PATCH /api/contact/form - 更新联系表单状态
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      )
    }

    const form = await prisma.contactForm.update({
      where: { id },
      data: {
        status,
        notes,
      },
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error updating contact form:", error)
    return NextResponse.json(
      { error: "Failed to update contact form" },
      { status: 500 }
    )
  }
}

// DELETE /api/contact/form - 删除联系表单
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      )
    }

    // 删除相关的响应记录
    await prisma.contactResponse.deleteMany({
      where: { formId: id }
    })

    // 删除联系表单
    await prisma.contactForm.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact form:", error)
    return NextResponse.json(
      { error: "Failed to delete contact form" },
      { status: 500 }
    )
  }
} 