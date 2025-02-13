import { PrismaClient } from '@prisma/client'
import products from '../src/data/products'

interface ProductImage {
  url: string
  alt: string
}

interface ProductDocument {
  icon: string
  title: string
  description: string
  fileSize: string
  downloadUrl: string
}

interface MockProduct {
  name: string
  description: string
  fullDescription: string
  price: string
  images: ProductImage[]
  documents: ProductDocument[]
  features: any[]
  specifications: any[]
  models: any[]
}

const prisma = new PrismaClient()

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

      const typedProduct = product as MockProduct
      const productData = {
        name: typedProduct.name,
        slug: slug,
        category: 'Battery Emulators', // 默认分类
        price: typedProduct.price,
        status: 'Active',
        description: typedProduct.description,
        images: JSON.stringify(typedProduct.images),
        files: JSON.stringify(typedProduct.documents),
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

async function main() {
  try {
    await migrateProducts()
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 