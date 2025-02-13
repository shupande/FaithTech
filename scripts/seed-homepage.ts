import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    // Delete existing homepage sections
    await prisma.sectionContent.deleteMany({
      where: {
        name: {
          startsWith: 'home'
        }
      }
    })

    // Create home section with both hero and features content
    const home = await prisma.sectionContent.create({
      data: {
        name: 'home',
        title: 'Welcome to FaithTech',
        description: 'Empowering faith communities with modern technology solutions.',
        badge: JSON.stringify({
          text: 'New Features',
          action: {
            text: 'Learn More',
            href: '/features'
          }
        }),
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
        media: JSON.stringify({
          url: '/images/hero.jpg',
          type: 'image'
        }),
        featureTitle: 'Key Features',
        featureSubtitle: 'Discover what makes our battery emulation solutions stand out',
        mapTitle: 'Remote Connectivity',
        mapSubtitle: 'Break free from traditional boundaries. Work from anywhere, at the comfort of your own studio apartment. Perfect for Nomads and Travellers.',
        features: JSON.stringify([
          {
            id: '1',
            title: 'High Performance',
            description: 'Industry-leading response times and precision for accurate battery simulation.',
            icon: 'Zap'
          },
          {
            id: '2',
            title: 'Configurable',
            description: 'Easily customize parameters to match your specific testing requirements.',
            icon: 'Settings'
          },
          {
            id: '3',
            title: 'Real-time Analytics',
            description: 'Monitor and analyze battery behavior with advanced data visualization tools.',
            icon: 'BarChart3'
          },
          {
            id: '4',
            title: 'Safety Features',
            description: 'Built-in protection mechanisms ensure safe operation during testing.',
            icon: 'Shield'
          },
          {
            id: '5',
            title: 'Advanced Control',
            description: 'Sophisticated control algorithms for precise battery behavior emulation.',
            icon: 'Cpu'
          },
          {
            id: '6',
            title: 'Multiple Models',
            description: 'Support for various battery types and chemistries in a single device.',
            icon: 'Battery'
          }
        ]),
        status: 'Active'
      }
    })

    console.log('Homepage section created:', { home })
  } catch (error) {
    console.error('Error seeding homepage section:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 