import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    const hashedPassword = await hash('admin123', 10)

    // 查找第一个管理员用户并更新
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          email: 'admin@faithtechate.com',
          password: hashedPassword,
          name: 'Admin',
          status: 'active'
        }
      })
      console.log('Admin user has been reset successfully')
    } else {
      // 如果没有找到管理员用户，创建一个新的
      await prisma.user.create({
        data: {
          email: 'admin@faithtechate.com',
          password: hashedPassword,
          name: 'Admin',
          role: 'admin',
          status: 'active'
        }
      })
      console.log('New admin user has been created successfully')
    }
  } catch (error) {
    console.error('Error resetting admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdmin() 