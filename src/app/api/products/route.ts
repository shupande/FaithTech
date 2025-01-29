import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withErrorHandler, withValidation, createPaginatedResponse, createApiResponse } from '../utils'

// Mock data - replace with database calls
export let products = [
  {
    id: '1',
    name: 'Product 1',
    slug: 'product-1',
    category: 'Category A',
    price: '$99',
    status: 'Active' as const,
    description: 'This is product 1',
    images: [
      {
        url: 'https://via.placeholder.com/300',
        alt: 'Product 1 Image',
      }
    ],
    files: [
      {
        name: 'Product Manual',
        url: 'https://example.com/manual.pdf',
        size: 1024 * 1024, // 1MB
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Product 2',
    slug: 'product-2',
    category: 'Category B',
    price: '$199',
    status: 'Coming Soon' as const,
    description: 'This is product 2',
    images: [
      {
        url: 'https://via.placeholder.com/300',
        alt: 'Product 2 Image',
      }
    ],
    files: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Active', 'Coming Soon', 'Discontinued']).optional(),
})

// GET /api/products
export const GET = withErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url)
  const query = querySchema.parse(Object.fromEntries(searchParams))
  
  let filteredProducts = [...products]
  
  // Apply filters
  if (query.search) {
    filteredProducts = filteredProducts.filter(
      product =>
        product.name.toLowerCase().includes(query.search!.toLowerCase()) ||
        product.slug.toLowerCase().includes(query.search!.toLowerCase()) ||
        product.description.toLowerCase().includes(query.search!.toLowerCase())
    )
  }
  
  if (query.category) {
    filteredProducts = filteredProducts.filter(
      product => product.category === query.category
    )
  }
  
  if (query.status) {
    filteredProducts = filteredProducts.filter(
      product => product.status === query.status
    )
  }
  
  // Apply pagination
  const start = (query.page - 1) * query.perPage
  const end = start + query.perPage
  const paginatedProducts = filteredProducts.slice(start, end)
  
  return NextResponse.json(
    createPaginatedResponse(
      paginatedProducts,
      filteredProducts.length,
      query.page,
      query.perPage
    )
  )
})

const createProductSchema = z.object({
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

// POST /api/products
export const POST = withErrorHandler(
  withValidation(createProductSchema, async (req) => {
    const data = req.validatedData
    
    // Check if slug is unique
    if (products.some(p => p.slug === data.slug)) {
      return NextResponse.json(
        { message: 'Slug already exists' },
        { status: 400 }
      )
    }
    
    const product = {
      id: (products.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    products.push(product)
    
    return NextResponse.json(createApiResponse(product), { status: 201 })
  })
) 