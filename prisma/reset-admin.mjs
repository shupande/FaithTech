import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
const { hash } = bcryptjs

const prisma = new PrismaClient()

async function resetAdmin() {
  try {
    const hashedPassword = await hash('admin123', 10)

    // Find first admin user and update
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
      // If no admin user found, create a new one
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