import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from "@/lib/prisma"
import { Prisma } from '@prisma/client'

// 定义产品类型
type ProductWithJson = Prisma.ProductGetPayload<{}> & {
  features: string
  specifications: string
  models: string
  fullDescription: string
}

// GET /api/products/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "Product ID or slug required"
      }, { status: 400 })
    }

    // 尝试通过 ID 查询
    let product = await prisma.product.findUnique({
      where: { id: params.id }
    }) as ProductWithJson | null

    // 如果没找到，尝试通过 slug 查询
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: params.id }
      }) as ProductWithJson | null
    }

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    let images: string[] = []
    let files: any[] = []

    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        images = Array.isArray(parsedImages) ? parsedImages.map((img: string) => {
          if (img.startsWith('http') || (baseUrl && img.startsWith(baseUrl))) {
            return img
          }
          return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
        }) : []
      } catch (e) {
        console.error('Error parsing images:', e)
        images = []
      }
    }

    if (product.files) {
      try {
        const parsedFiles = JSON.parse(product.files)
        files = Array.isArray(parsedFiles) ? parsedFiles.map(file => ({
          ...file,
          url: file.url.startsWith('http') || (baseUrl && file.url.startsWith(baseUrl))
            ? file.url
            : `${baseUrl}${file.url.startsWith('/') ? '' : '/'}${file.url}`
        })) : []
      } catch (e) {
        console.error('Error parsing files:', e)
        files = []
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images,
        files,
        features: product.features || '',
        specifications: product.specifications || '',
        models: product.models || '',
        fullDescription: product.fullDescription || ''
      }
    })
  } catch (error) {
    console.error('[PRODUCT_GET]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
}

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  features: z.string().optional(),
  specifications: z.string().optional(),
  models: z.string().optional(),
  images: z.string().optional(),
  files: z.string().optional(),
})

// PUT /api/products/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "Product ID or slug required"
      }, { status: 400 })
    }

    const body = await req.json()
    console.log('[PRODUCT_UPDATE_REQUEST]', { id: params.id, body })

    // 验证请求数据
    const validationResult = updateProductSchema.safeParse(body)
    if (!validationResult.success) {
      console.error('[PRODUCT_UPDATE_VALIDATION_ERROR]', validationResult.error)
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.errors
      }, { status: 400 })
    }

    const data = validationResult.data

    // 尝试通过 ID 查询
    let existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    // 如果没找到，尝试通过 slug 查询
    if (!existingProduct) {
      existingProduct = await prisma.product.findUnique({
        where: { slug: params.id }
      })
    }

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 })
    }

    // 如果要更新 slug，检查是否已存在
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return NextResponse.json({
          success: false,
          message: 'Slug already exists'
        }, { status: 400 })
      }
    }

    // 准备更新数据，过滤掉 undefined 的字段
    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.status && { status: data.status }),
      ...(data.description && { description: data.description }),
      ...(data.features !== undefined && { features: data.features }),
      ...(data.specifications !== undefined && { specifications: data.specifications }),
      ...(data.models !== undefined && { models: data.models }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.files !== undefined && { files: data.files }),
    }

    console.log('[PRODUCT_UPDATE_DATA]', updateData)

    try {
      // 更新产品
      const product = await prisma.product.update({
        where: { id: existingProduct.id },
        data: updateData
      }) as ProductWithJson

      console.log('[PRODUCT_UPDATED]', product)

      return NextResponse.json({
        success: true,
        data: {
          ...product,
          images: product.images ? JSON.parse(product.images) : [],
          files: product.files ? JSON.parse(product.files) : [],
          features: product.features || '',
          specifications: product.specifications || '',
          models: product.models || ''
        }
      })
    } catch (updateError) {
      console.error('[PRODUCT_UPDATE_ERROR]', updateError)
      throw updateError
    }
  } catch (error) {
    console.error('[PRODUCT_UPDATE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error',
      error: error instanceof Error ? error.toString() : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        message: "Product ID or slug required"
      }, { status: 400 })
    }

    // 尝试通过 ID 查询
    let existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    // 如果没找到，尝试通过 slug 查询
    if (!existingProduct) {
      existingProduct = await prisma.product.findUnique({
        where: { slug: params.id }
      })
    }

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 })
    }

    // 真正的删除操作
    await prisma.product.delete({
      where: { id: existingProduct.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal error'
    }, { status: 500 })
  }
} 