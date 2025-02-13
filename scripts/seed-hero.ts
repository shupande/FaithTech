import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    // Delete existing hero section if it exists
    await prisma.sectionContent.deleteMany({
      where: {
        name: 'home_hero'
      }
    })

    // Create new hero section
    const hero = await prisma.sectionContent.create({
      data: {
        name: 'home_hero',
        title: 'Welcome to FaithTech',
        description: 'Empowering faith communities with modern technology solutions.',
        badge: JSON.stringify('New Features'),
        actions: JSON.stringify([
          {
            text: 'Get Started',
            href: '/get-started',
            variant: 'default'
          },
          {
            text: 'Learn More',
            href: '/about',
            variant: 'outline'
          }
        ]),
        image: '/images/hero.jpg',
        status: 'Active'
      }
    })

    console.log('Hero section created:', hero)
  } catch (error) {
    console.error('Error seeding hero section:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 