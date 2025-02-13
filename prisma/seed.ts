import { PrismaClient } from '@prisma/client'
import pkg from 'bcryptjs'
const { hash } = pkg

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const hashedPassword = await hash(adminPassword, 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    })

    console.log({ admin })
    console.log('Admin user created successfully')
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 