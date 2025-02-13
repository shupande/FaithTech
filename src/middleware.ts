import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 检查是否是公共文件请求
  if (
    [
      '/images/',
      '/favicon.ico',
      '/manifest.json',
      '/robots.txt',
      // 添加其他静态资源路径
    ].some(path => pathname.startsWith(path))
  ) {
    return
  }

  const response = NextResponse.next()
  return response
}

export const config = {
  // 匹配所有页面路径
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
} 