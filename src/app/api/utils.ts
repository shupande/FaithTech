import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { NextRequest } from 'next/server'

export interface ApiContext {
  params: Record<string, string>
}

declare module 'next/server' {
  interface NextRequest {
    validatedData?: any
  }
}

export type ApiHandler = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse>

export const withErrorHandler = (handler: ApiHandler): ApiHandler => {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error('API Error:', error)
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export const withAuth = (handler: ApiHandler): ApiHandler => {
  return async (req: NextRequest, context: ApiContext) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    // TODO: Verify token
    // const user = await verifyToken(token)
    
    return handler(req, context)
  }
}

export const withValidation = <T extends z.ZodType>(
  schema: T,
  handler: (req: NextRequest & { validatedData: z.infer<T> }, context: ApiContext) => Promise<NextResponse>
): ApiHandler => {
  return async (req, context) => {
    try {
      const data = await req.json()
      const validatedData = schema.parse(data)
      ;(req as any).validatedData = validatedData
      return await handler(req as any, context)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: 'Validation error', errors: error.errors },
          { status: 400 }
        )
      }
      throw error
    }
  }
}

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
) => {
  return {
    data,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  }
}

export const createApiResponse = <T>(data: T, message?: string) => {
  return {
    data,
    message,
  }
} 