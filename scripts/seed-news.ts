import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const news = [
  {
    title: 'Introducing BatteryEmulator 3000: Next-Generation Battery Testing',
    slug: 'introducing-batteryemulator-3000',
    category: 'Product Launch',
    status: 'Published',
    publishDate: new Date('2024-03-15'),
    content: `
      <p>We are excited to announce the launch of our latest flagship product, the BatteryEmulator 3000. This next-generation battery testing solution represents a significant leap forward in battery emulation technology, offering unprecedented precision and AI-driven capabilities.</p>

      <h2>Key Innovations</h2>
      <ul>
        <li>Advanced AI-driven battery modeling for more accurate emulation</li>
        <li>Extended voltage range (0-100V) and current capability (up to 50A)</li>
        <li>Real-time cloud analytics and remote operation</li>
        <li>Multi-unit synchronization for large-scale testing</li>
      </ul>

      <h2>Enhanced Testing Capabilities</h2>
      <p>The BatteryEmulator 3000 introduces several groundbreaking features that set new standards in battery testing:</p>
      <ul>
        <li>Microsecond-level response times for precise emulation</li>
        <li>Advanced thermal modeling and simulation</li>
        <li>Integrated safety features and protection mechanisms</li>
        <li>Comprehensive data logging and analysis tools</li>
      </ul>

      <h2>Industry Applications</h2>
      <p>This new model is specifically designed to meet the demanding requirements of:</p>
      <ul>
        <li>Electric vehicle development and testing</li>
        <li>Renewable energy storage systems</li>
        <li>Consumer electronics manufacturing</li>
        <li>Research and development laboratories</li>
      </ul>
    `,
    coverImage: JSON.stringify({
      url: '/images/news/be-3000-launch.jpg',
      alt: 'BatteryEmulator 3000 Launch'
    })
  },
  {
    title: 'BatteryEmulator Opens New R&D Center in Munich',
    slug: 'batteryemulator-opens-new-rd-center-in-munich',
    category: 'Company News',
    status: 'Published',
    publishDate: new Date('2024-03-01'),
    content: `
      <p>We are proud to announce the opening of our new Research & Development Center in Munich, Germany. This strategic expansion marks a significant milestone in our commitment to advancing battery emulation technology and serving our European customers.</p>

      <h2>State-of-the-Art Facility</h2>
      <p>The new R&D center features:</p>
      <ul>
        <li>Advanced testing laboratories</li>
        <li>Dedicated research spaces</li>
        <li>Collaborative work environments</li>
        <li>Customer training facilities</li>
      </ul>

      <h2>Research Focus Areas</h2>
      <p>Our Munich team will focus on:</p>
      <ul>
        <li>Next-generation battery emulation technologies</li>
        <li>Advanced power electronics development</li>
        <li>Software and firmware innovations</li>
        <li>Industry-specific solutions</li>
      </ul>

      <h2>European Market Support</h2>
      <p>This new facility will enhance our ability to:</p>
      <ul>
        <li>Provide local technical support</li>
        <li>Collaborate with European partners</li>
        <li>Accelerate product development</li>
        <li>Deliver customized solutions</li>
      </ul>
    `,
    coverImage: JSON.stringify({
      url: '/images/news/munich-rd.jpg',
      alt: 'Munich R&D Center'
    })
  },
  {
    title: 'Partnership Announcement: Leading EV Manufacturer',
    slug: 'partnership-announcement-leading-ev-manufacturer',
    category: 'Partnership',
    status: 'Published',
    publishDate: new Date('2024-02-20'),
    content: `
      <p>We are excited to announce our strategic partnership with a leading electric vehicle manufacturer to advance battery testing capabilities in the automotive industry.</p>

      <h2>Partnership Objectives</h2>
      <ul>
        <li>Development of specialized testing solutions</li>
        <li>Integration of advanced battery modeling</li>
        <li>Creation of industry-specific testing protocols</li>
        <li>Joint research initiatives</li>
      </ul>

      <h2>Technology Integration</h2>
      <p>Key aspects of the collaboration include:</p>
      <ul>
        <li>Custom battery emulation profiles</li>
        <li>Advanced testing automation</li>
        <li>Real-time data analytics</li>
        <li>Specialized reporting tools</li>
      </ul>

      <h2>Industry Impact</h2>
      <p>This partnership will contribute to:</p>
      <ul>
        <li>Accelerated EV development cycles</li>
        <li>Enhanced battery testing standards</li>
        <li>Improved safety protocols</li>
        <li>Reduced development costs</li>
      </ul>
    `,
    coverImage: JSON.stringify({
      url: '/images/news/ev-partnership.jpg',
      alt: 'EV Partnership'
    })
  },
  {
    title: 'Software Update: Enhanced Data Analytics Features',
    slug: 'software-update-enhanced-data-analytics-features',
    category: 'Software Update',
    status: 'Published',
    publishDate: new Date('2024-02-15'),
    content: `
      <p>We are pleased to announce the latest software update for our BatteryEmulator products, featuring enhanced data analytics capabilities.</p>
      <p>The update includes advanced reporting and real-time monitoring features that will help our users better understand and analyze their battery testing data.</p>
    `
  },
  {
    title: 'BatteryEmulator at Battery Tech Expo 2024',
    slug: 'batteryemulator-at-battery-tech-expo-2024',
    category: 'Events',
    status: 'Published',
    publishDate: new Date('2024-02-10'),
    content: `
      <p>Join us at the largest battery technology exhibition in North America.</p>
      <p>We will be showcasing our latest products and innovations in battery emulation technology.</p>
    `
  },
  {
    title: 'New Training Program for Battery Test Engineers',
    slug: 'new-training-program-for-battery-test-engineers',
    category: 'Training',
    status: 'Published',
    publishDate: new Date('2024-02-01'),
    content: `
      <p>We are launching a comprehensive certification program for professional battery test engineers.</p>
      <p>The program covers advanced testing methodologies and best practices in battery emulation.</p>
    `
  },
  {
    title: 'Q4 2023 Performance Results',
    slug: 'q4-2023-performance-results',
    category: 'Company News',
    status: 'Published',
    publishDate: new Date('2024-01-25'),
    content: `
      <p>We are pleased to report record growth in global market share and customer satisfaction ratings.</p>
      <p>Our commitment to innovation and customer service continues to drive our success.</p>
    `
  },
  {
    title: 'Technical White Paper: Advanced Battery Modeling',
    slug: 'technical-white-paper-advanced-battery-modeling',
    category: 'Research',
    status: 'Published',
    publishDate: new Date('2024-01-15'),
    content: `
      <p>We have published a new research paper on next-generation battery simulation techniques.</p>
      <p>The paper details our latest advances in battery modeling and simulation technology.</p>
    `
  }
]

async function main() {
  console.log('Start seeding news...')

  // Clear existing news
  await prisma.news.deleteMany()
  console.log('Cleared existing news')

  for (const item of news) {
    const result = await prisma.news.create({
      data: item
    })
    console.log(`Created news with ID: ${result.id}`)
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