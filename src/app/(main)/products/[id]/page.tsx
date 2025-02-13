import { Metadata } from 'next'
import { ProductContent } from './product-content'
import { prisma } from "@/lib/prisma"
import { notFound } from 'next/navigation'

interface ProductFeature {
  icon: string
  title: string
  description: string
}

interface ProductSpecification {
  name: string
  value: string
}

interface ProductDocument {
  icon: string
  title: string
  description: string
  fileSize: string
  downloadUrl: string
}

interface ProductModel {
  name: string
  description: string
  features: string[]
}

interface ProductImage {
  url: string;
  alt: string;
}

interface CategoryPath {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  fullDescription?: string
  features: string
  specifications: string
  models: string
  documents: ProductDocument[]
  images: ProductImage[]
  categoryPath: CategoryPath[]
}

// 获取分类路径
async function getCategoryPath(categoryId: string): Promise<CategoryPath[]> {
  const path: CategoryPath[] = []
  let currentCategory = await prisma.productCategory.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true
    }
  })

  while (currentCategory) {
    path.unshift({
      id: currentCategory.id,
      name: currentCategory.name,
      slug: currentCategory.slug
    })
    
    if (!currentCategory.parentId) break
    
    currentCategory = await prisma.productCategory.findUnique({
      where: { id: currentCategory.parentId },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true
      }
    })
  }

  return path
}

// 获取产品数据
async function getProduct(id: string): Promise<Product | null> {
  try {
    // 尝试通过 ID 查询
    let dbProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    // 如果没找到，尝试通过 slug 查询
    if (!dbProduct) {
      dbProduct = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: true
        }
      })
    }

    if (!dbProduct) {
      return null
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const defaultImage: ProductImage = {
      url: '/images/product-placeholder.jpg',
      alt: 'Product Image'
    }

    let productImages: ProductImage[] = []
    try {
      if (dbProduct.images) {
        const parsedImages = JSON.parse(dbProduct.images)
        if (Array.isArray(parsedImages)) {
          productImages = parsedImages.map(img => {
            if (typeof img === 'string') {
              const url = img.startsWith('http') || (baseUrl && img.startsWith(baseUrl))
                ? img
                : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
              return {
                url,
                alt: dbProduct.name || 'Product Image'
              }
            }
            return {
              url: img?.url || defaultImage.url,
              alt: img?.alt || defaultImage.alt
            }
          })
        }
      }
    } catch (error) {
      console.error('Failed to parse product images:', error)
    }

    if (productImages.length === 0) {
      productImages = [defaultImage]
    }

    // 获取分类路径
    const categoryPath = await getCategoryPath(dbProduct.categoryId)

    const product: Product = {
      id: dbProduct.id,
      name: dbProduct.name,
      slug: dbProduct.slug,
      description: dbProduct.description,
      fullDescription: dbProduct.description,
      features: dbProduct.features || '',
      specifications: dbProduct.specifications || '',
      models: dbProduct.models || '',
      images: productImages,
      categoryPath,
      documents: dbProduct.files ? JSON.parse(dbProduct.files).map((file: any) => ({
        icon: 'file',
        title: file.name || 'Document',
        description: 'Product documentation',
        fileSize: file.size ? `${Math.round(file.size / 1024)}KB` : 'Unknown size',
        downloadUrl: file.url || '#'
      })) : []
    }

    return product
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

// 获取相关产品
async function getRelatedProducts(currentId: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { not: currentId },
        status: 'Active'
      },
      include: {
        category: true
      },
      take: 3,
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const defaultImage: ProductImage = {
      url: '/images/product-placeholder.jpg',
      alt: 'Product Image'
    }

    const processedProducts = await Promise.all(products.map(async dbProduct => {
      let productImages: ProductImage[] = []
      try {
        if (dbProduct.images) {
          const parsedImages = JSON.parse(dbProduct.images)
          if (Array.isArray(parsedImages)) {
            productImages = parsedImages.map(img => {
              if (typeof img === 'string') {
                const url = img.startsWith('http') || (baseUrl && img.startsWith(baseUrl))
                  ? img
                  : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
                return {
                  url,
                  alt: dbProduct.name || 'Product Image'
                }
              }
              return {
                url: img?.url || defaultImage.url,
                alt: img?.alt || defaultImage.alt
              }
            })
          }
        }
      } catch (error) {
        console.error('Failed to parse related product images:', error)
      }

      if (productImages.length === 0) {
        productImages = [defaultImage]
      }

      // 获取分类路径
      const categoryPath = await getCategoryPath(dbProduct.categoryId)

      return {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        fullDescription: dbProduct.description,
        features: dbProduct.features || '',
        specifications: dbProduct.specifications || '',
        models: dbProduct.models || '',
        images: productImages,
        categoryPath,
        documents: dbProduct.files ? JSON.parse(dbProduct.files).map((file: any) => ({
          icon: 'file',
          title: file.name || 'Document',
          description: 'Product documentation',
          fileSize: file.size ? `${Math.round(file.size / 1024)}KB` : 'Unknown size',
          downloadUrl: file.url || '#'
        })) : []
      }
    }))

    return processedProducts
  } catch (error) {
    console.error('Failed to fetch related products:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found - BatteryEmulator',
      description: 'The requested product could not be found.',
    }
  }
  
  return {
    title: `${product.name} - BatteryEmulator`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }

  // 获取相关产品
  const relatedProducts = await getRelatedProducts(product.id)

  return (
    <ProductContent 
      product={product} 
      relatedProducts={relatedProducts} 
      productId={product.slug}
    />
  )
} 