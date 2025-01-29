import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withErrorHandler, withValidation, createApiResponse } from '../../utils'
import type { ApiContext } from '../../utils'

// Import mock data from parent
import { products } from '../route'

// GET /api/products/[id]
export const GET = withErrorHandler(async (req, context: ApiContext) => {
  const product = products.find(p => p.id === context.params.id)
  
  if (!product) {
    return NextResponse.json(
      { message: 'Product not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(createApiResponse(product))
})

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().min(1, 'Price is required'),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
  })).min(1, 'At least one image is required'),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
})

// PUT /api/products/[id]
export const PUT = withErrorHandler(
  withValidation(updateProductSchema, async (req, context: ApiContext) => {
    const data = req.validatedData
    const index = products.findIndex(p => p.id === context.params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Check if slug is unique (excluding current product)
    if (products.some(p => p.slug === data.slug && p.id !== context.params.id)) {
      return NextResponse.json(
        { message: 'Slug already exists' },
        { status: 400 }
      )
    }
    
    const updatedProduct = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    products[index] = updatedProduct
    
    return NextResponse.json(createApiResponse(updatedProduct))
  })
)

// DELETE /api/products/[id]
export const DELETE = withErrorHandler(async (req, context: ApiContext) => {
  const index = products.findIndex(p => p.id === context.params.id)
  
  if (index === -1) {
    return NextResponse.json(
      { message: 'Product not found' },
      { status: 404 }
    )
  }
  
  products.splice(index, 1)
  
  return NextResponse.json(createApiResponse(null))
}) 