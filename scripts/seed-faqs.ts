import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const faqs = [
  {
    question: "What is a Battery Emulator?",
    answer: "A Battery Emulator is a sophisticated device that simulates the behavior of various battery types. It allows engineers and researchers to test their devices with different battery characteristics without using actual batteries, saving time and resources while ensuring consistent test conditions.",
    category: "General",
    order: 1,
    status: "Active"
  },
  {
    question: "Which battery types can be emulated?",
    answer: "Our Battery Emulators support a wide range of battery types including Lithium-ion, LiFePO4, Lead-acid, and NiMH batteries. Each model can be configured to match specific battery characteristics and behaviors.",
    category: "Technical",
    order: 2,
    status: "Active"
  },
  {
    question: "What are the main applications?",
    answer: "Battery Emulators are commonly used in R&D labs, production testing, quality control, and educational institutions. They're essential for testing battery-powered devices, battery charging systems, and power management systems.",
    category: "Applications",
    order: 3,
    status: "Active"
  },
  {
    question: "How accurate is the battery simulation?",
    answer: "Our Battery Emulators provide highly accurate simulations with response times in microseconds and voltage/current accuracy typically better than 0.1%. The exact specifications vary by model and can be found in each product's technical documentation.",
    category: "Technical",
    order: 4,
    status: "Active"
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Yes, we offer customized Battery Emulator solutions to meet specific requirements. Our team can work with you to develop a solution that matches your exact testing needs, including custom voltage ranges, current capabilities, and special features.",
    category: "Services",
    order: 5,
    status: "Active"
  }
] as const

async function main() {
  console.log('Start seeding FAQs...')

  // 清除现有的 FAQ 数据
  await prisma.fAQ.deleteMany()
  console.log('Cleared existing FAQs')

  for (const faq of faqs) {
    const result = await prisma.fAQ.create({
      data: faq
    })
    console.log(`Created FAQ with ID: ${result.id}`)
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 