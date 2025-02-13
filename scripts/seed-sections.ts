import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sections = [
  {
    name: 'home_hero',
    title: 'Advanced Battery Emulation Solutions',
    description: 'Professional battery emulators providing precise battery characteristic simulation for your device testing and development. From small devices to large-scale industrial applications, we meet all your needs.',
    badge: JSON.stringify({
      text: "New Battery Emulator Series",
      action: {
        text: "Learn More",
        href: "/products",
      },
    }),
    actions: JSON.stringify([
      {
        text: "Browse Products",
        href: "/products",
        variant: "default",
      },
      {
        text: "Contact Us",
        href: "/contact",
        variant: "glow",
      },
    ]),
    image: JSON.stringify({
      light: "/images/battery-emulator-preview.jpeg",
      dark: "/images/battery-emulator-preview.jpeg",
      alt: "Battery Emulator Preview",
    }),
    status: 'Active'
  }
]

async function main() {
  console.log('Start seeding sections...')

  // Clear existing sections
  await prisma.sectionContent.deleteMany()
  console.log('Cleared existing sections')

  for (const section of sections) {
    const result = await prisma.sectionContent.create({
      data: section
    })
    console.log(`Created section with ID: ${result.id}`)
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