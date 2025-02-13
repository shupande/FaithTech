import { PrismaClient } from '@prisma/client'
import products from '../src/data/products.js'

const prisma = new PrismaClient()

const faqs = [
  {
    question: "What is a Battery Emulator?",
    answer: "A Battery Emulator is a sophisticated device that simulates the behavior of various battery types. It allows engineers and researchers to test their devices with different battery characteristics without using actual batteries, saving time and resources while ensuring consistent test conditions.",
    category: "General",
    order: 1
  },
  {
    question: "Which battery types can be emulated?",
    answer: "Our Battery Emulators support a wide range of battery types including Lithium-ion, LiFePO4, Lead-acid, and NiMH batteries. Each model can be configured to match specific battery characteristics and behaviors.",
    category: "Technical",
    order: 2
  },
  {
    question: "What are the main applications?",
    answer: "Battery Emulators are commonly used in R&D labs, production testing, quality control, and educational institutions. They're essential for testing battery-powered devices, battery charging systems, and power management systems.",
    category: "Applications",
    order: 3
  },
  {
    question: "How accurate is the battery simulation?",
    answer: "Our Battery Emulators provide highly accurate simulations with response times in microseconds and voltage/current accuracy typically better than 0.1%. The exact specifications vary by model and can be found in each product's technical documentation.",
    category: "Technical",
    order: 4
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Yes, we offer customized Battery Emulator solutions to meet specific requirements. Our team can work with you to develop a solution that matches your exact testing needs, including custom voltage ranges, current capabilities, and special features.",
    category: "Services",
    order: 5
  }
]

const solutions = [
  {
    title: "Research & Development",
    slug: "research-development",
    category: "Laboratory",
    status: "Active",
    description: "Advanced battery emulation solutions for R&D laboratories",
    content: "Our R&D solutions provide researchers with precise control over battery characteristics...",
    features: JSON.stringify([
      { title: "High Precision", description: "Industry-leading accuracy in voltage and current control" },
      { title: "Flexible Configuration", description: "Easily simulate various battery types and conditions" }
    ]),
    coverImage: JSON.stringify({
      url: "/images/solutions/rd-lab.jpg",
      alt: "R&D Laboratory Setup"
    })
  },
  {
    title: "Production Testing",
    slug: "production-testing",
    category: "Manufacturing",
    status: "Active",
    description: "Streamline your production testing process",
    content: "Optimize your production line with our automated testing solutions...",
    features: JSON.stringify([
      { title: "High Throughput", description: "Test multiple devices simultaneously" },
      { title: "Automated Workflows", description: "Reduce manual intervention and human error" }
    ]),
    coverImage: JSON.stringify({
      url: "/images/solutions/production.jpg",
      alt: "Production Testing Setup"
    })
  }
]

const services = [
  {
    title: "Custom Development",
    slug: "custom-development",
    category: "Engineering",
    status: "Active",
    description: "Tailored battery emulation solutions for your specific needs",
    content: "Our engineering team works closely with you to develop custom solutions...",
    features: JSON.stringify([
      "Requirements analysis",
      "Custom hardware design",
      "Software integration",
      "Validation and testing"
    ]),
    icon: JSON.stringify({
      name: "code",
      color: "blue"
    })
  },
  {
    title: "Technical Support",
    slug: "technical-support",
    category: "Support",
    status: "Active",
    description: "24/7 technical support for all our products",
    content: "Get expert help whenever you need it...",
    features: JSON.stringify([
      "24/7 availability",
      "Remote diagnostics",
      "On-site support",
      "Training sessions"
    ]),
    icon: JSON.stringify({
      name: "help-circle",
      color: "green"
    })
  }
]

const pages = [
  {
    title: "Home",
    slug: "home",
    status: "Published",
    content: "Welcome to our battery emulation solutions...",
    seo: JSON.stringify({
      title: "Battery Emulation Solutions | Home",
      description: "Leading provider of battery emulation technology",
      keywords: ["battery emulator", "testing equipment", "R&D solutions"]
    })
  },
  {
    title: "About Us",
    slug: "about",
    status: "Published",
    content: "Learn about our company and mission...",
    seo: JSON.stringify({
      title: "About Us | Battery Emulation Solutions",
      description: "Learn about our company history and mission",
      keywords: ["about", "company", "mission", "team"]
    })
  }
]

const navigation = [
  {
    title: "Main Navigation",
    type: "header",
    status: "Active",
    items: JSON.stringify([
      {
        title: "Products",
        path: "/products",
        children: [
          { title: "Battery Emulators", path: "/products/battery-emulators" },
          { title: "Accessories", path: "/products/accessories" }
        ]
      },
      {
        title: "Solutions",
        path: "/solutions",
        children: [
          { title: "R&D", path: "/solutions/research-development" },
          { title: "Production", path: "/solutions/production-testing" }
        ]
      }
    ])
  },
  {
    title: "Footer Navigation",
    type: "footer",
    status: "Active",
    items: JSON.stringify([
      { title: "About", path: "/about" },
      { title: "Contact", path: "/contact" },
      { title: "Support", path: "/support" }
    ])
  }
]

const legal = [
  {
    title: "Terms of Service",
    slug: "terms-of-service",
    type: "terms",
    status: "Active",
    content: "These Terms of Service govern your use of our website and services...",
    version: "1.0",
    effectiveDate: new Date("2024-01-01")
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    type: "privacy",
    status: "Active",
    content: "This Privacy Policy describes how we collect and use your information...",
    version: "1.0",
    effectiveDate: new Date("2024-01-01")
  }
]

const support = [
  {
    title: "Product Documentation",
    slug: "product-documentation",
    category: "Documentation",
    status: "Active",
    content: "Access detailed product documentation and user guides...",
    attachments: JSON.stringify([
      {
        name: "User Manual.pdf",
        url: "/docs/user-manual.pdf",
        size: 2048576
      }
    ])
  },
  {
    title: "Troubleshooting Guide",
    slug: "troubleshooting",
    category: "Support",
    status: "Active",
    content: "Common issues and their solutions...",
    attachments: JSON.stringify([
      {
        name: "Troubleshooting Guide.pdf",
        url: "/docs/troubleshooting.pdf",
        size: 1048576
      }
    ])
  }
]

const news = [
  {
    title: "New Battery Emulator Series Released",
    slug: "new-battery-emulator-series",
    category: "Product News",
    status: "Published",
    publishDate: new Date("2024-03-01"),
    content: "We are excited to announce the release of our latest Battery Emulator series...",
    coverImage: JSON.stringify({
      url: "/images/news/new-series.jpg",
      alt: "New Battery Emulator Series"
    }),
    attachments: JSON.stringify([
      {
        name: "Press Release.pdf",
        url: "/docs/press-release-2024.pdf",
        size: 1048576
      }
    ])
  },
  {
    title: "Expanding Global Support Network",
    slug: "expanding-global-support",
    category: "Company News",
    status: "Published",
    publishDate: new Date("2024-02-15"),
    content: "As part of our commitment to providing excellent customer service...",
    coverImage: JSON.stringify({
      url: "/images/news/global-support.jpg",
      alt: "Global Support Network"
    }),
    attachments: JSON.stringify([
      {
        name: "Support Locations.pdf",
        url: "/docs/support-locations.pdf",
        size: 524288
      }
    ])
  }
]

async function migrateProducts() {
  console.log('Starting products migration...')
  
  for (const [slug, product] of Object.entries(products)) {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { slug }
      })

      if (existingProduct) {
        console.log(`Product ${slug} already exists, skipping...`)
        continue
      }

      const productData = {
        name: product.name,
        slug: slug,
        category: 'Battery Emulators',
        price: product.price,
        status: 'Active',
        description: product.description,
        images: JSON.stringify(product.images),
        files: JSON.stringify(product.documents),
      }

      await prisma.product.create({
        data: productData
      })

      console.log(`Created product: ${slug}`)
    } catch (error) {
      console.error(`Error creating product ${slug}:`, error)
    }
  }
}

async function migrateFAQs() {
  console.log('Starting FAQs migration...')
  
  for (const faq of faqs) {
    try {
      const existingFAQ = await prisma.fAQ.findFirst({
        where: { question: faq.question }
      })

      if (existingFAQ) {
        console.log(`FAQ "${faq.question}" already exists, skipping...`)
        continue
      }

      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: faq.order,
          status: 'Active'
        }
      })

      console.log(`Created FAQ: ${faq.question}`)
    } catch (error) {
      console.error(`Error creating FAQ "${faq.question}":`, error)
    }
  }
}

async function migrateNews() {
  console.log('Starting news migration...')
  
  for (const item of news) {
    try {
      const existingNews = await prisma.news.findUnique({
        where: { slug: item.slug }
      })

      if (existingNews) {
        console.log(`News "${item.title}" already exists, skipping...`)
        continue
      }

      await prisma.news.create({
        data: item
      })

      console.log(`Created news: ${item.title}`)
    } catch (error) {
      console.error(`Error creating news "${item.title}":`, error)
    }
  }
}

async function migrateSolutions() {
  console.log('Starting solutions migration...')
  
  for (const solution of solutions) {
    try {
      const existingSolution = await prisma.solution.findUnique({
        where: { slug: solution.slug }
      })

      if (existingSolution) {
        console.log(`Solution "${solution.title}" already exists, skipping...`)
        continue
      }

      await prisma.solution.create({
        data: solution
      })

      console.log(`Created solution: ${solution.title}`)
    } catch (error) {
      console.error(`Error creating solution "${solution.title}":`, error)
    }
  }
}

async function migrateServices() {
  console.log('Starting services migration...')
  
  for (const service of services) {
    try {
      const existingService = await prisma.service.findUnique({
        where: { slug: service.slug }
      })

      if (existingService) {
        console.log(`Service "${service.title}" already exists, skipping...`)
        continue
      }

      await prisma.service.create({
        data: service
      })

      console.log(`Created service: ${service.title}`)
    } catch (error) {
      console.error(`Error creating service "${service.title}":`, error)
    }
  }
}

async function migratePages() {
  console.log('Starting pages migration...')
  
  for (const page of pages) {
    try {
      const existingPage = await prisma.page.findUnique({
        where: { slug: page.slug }
      })

      if (existingPage) {
        console.log(`Page "${page.title}" already exists, skipping...`)
        continue
      }

      await prisma.page.create({
        data: page
      })

      console.log(`Created page: ${page.title}`)
    } catch (error) {
      console.error(`Error creating page "${page.title}":`, error)
    }
  }
}

async function migrateNavigation() {
  console.log('Starting navigation migration...')
  
  for (const nav of navigation) {
    try {
      const existingNav = await prisma.navigation.findFirst({
        where: { 
          title: nav.title,
          type: nav.type
        }
      })

      if (existingNav) {
        console.log(`Navigation "${nav.title}" already exists, skipping...`)
        continue
      }

      await prisma.navigation.create({
        data: nav
      })

      console.log(`Created navigation: ${nav.title}`)
    } catch (error) {
      console.error(`Error creating navigation "${nav.title}":`, error)
    }
  }
}

async function migrateLegal() {
  console.log('Starting legal documents migration...')
  
  for (const doc of legal) {
    try {
      const existingDoc = await prisma.legal.findUnique({
        where: { slug: doc.slug }
      })

      if (existingDoc) {
        console.log(`Legal document "${doc.title}" already exists, skipping...`)
        continue
      }

      await prisma.legal.create({
        data: doc
      })

      console.log(`Created legal document: ${doc.title}`)
    } catch (error) {
      console.error(`Error creating legal document "${doc.title}":`, error)
    }
  }
}

async function migrateSupport() {
  console.log('Starting support documents migration...')
  
  for (const doc of support) {
    try {
      const existingDoc = await prisma.support.findUnique({
        where: { slug: doc.slug }
      })

      if (existingDoc) {
        console.log(`Support document "${doc.title}" already exists, skipping...`)
        continue
      }

      await prisma.support.create({
        data: doc
      })

      console.log(`Created support document: ${doc.title}`)
    } catch (error) {
      console.error(`Error creating support document "${doc.title}":`, error)
    }
  }
}

async function main() {
  try {
    await migrateProducts()
    await migrateFAQs()
    await migrateNews()
    await migrateSolutions()
    await migrateServices()
    await migratePages()
    await migrateNavigation()
    await migrateLegal()
    await migrateSupport()
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 