import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create SEO report
  const report = await prisma.SEOReport.create({
    data: {
      score: 78,
      status: 'completed',
      issues: [
        {
          type: 'critical',
          message: 'Missing meta descriptions on product pages',
          category: 'content',
          priority: 1,
          count: 5
        },
        {
          type: 'warning',
          message: 'Low keyword density on homepage',
          category: 'content',
          priority: 2,
          count: 1
        },
        {
          type: 'success',
          message: 'Good use of header tags',
          category: 'content',
          priority: 3,
          count: 10
        }
      ],
      metrics: {
        totalPages: 25,
        averageScore: 78,
        criticalIssues: 3,
        warnings: 8,
        successes: 5
      },
      pages: {
        create: [
          {
            url: 'https://example.com',
            title: 'Homepage',
            description: 'Welcome to our website',
            keywords: 'tech, software, solutions',
            score: 85,
            issues: [
              {
                type: 'warning',
                message: 'Title could be more descriptive',
                category: 'content',
                priority: 2
              }
            ]
          },
          {
            url: 'https://example.com/products',
            title: 'Our Products',
            description: 'Explore our product lineup',
            keywords: 'products, software',
            score: 75,
            issues: [
              {
                type: 'critical',
                message: 'Missing meta description',
                category: 'content',
                priority: 1
              }
            ]
          }
        ]
      }
    }
  })

  // Create keyword rankings
  await prisma.keywordRanking.createMany({
    data: [
      {
        keyword: 'tech solutions',
        position: 3,
        change: 2,
        lastChecked: new Date()
      },
      {
        keyword: 'software platform',
        position: 5,
        change: -1,
        lastChecked: new Date()
      },
      {
        keyword: 'digital transformation',
        position: 8,
        change: 1,
        lastChecked: new Date()
      }
    ]
  })

  // Create competitor analysis
  await prisma.competitorAnalysis.createMany({
    data: [
      {
        competitor: 'Competitor A',
        domain: 'competitor-a.com',
        score: 82,
        strength: 'Content',
        metrics: {
          backlinks: 1500,
          domainAuthority: 45,
          contentScore: 85
        }
      },
      {
        competitor: 'Competitor B',
        domain: 'competitor-b.com',
        score: 76,
        strength: 'Technical',
        metrics: {
          backlinks: 1200,
          domainAuthority: 40,
          contentScore: 70
        }
      }
    ]
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error('Error creating seed data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 