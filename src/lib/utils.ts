import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getImageUrl(path: string): string {
  // 如果是完整的URL，解析并替换主机和端口
  if (path.startsWith('http')) {
    try {
      const url = new URL(path)
      if (url.hostname === 'localhost') {
        url.port = process.env.NEXT_PUBLIC_PORT || '3000'
        return url.toString()
      }
      return path
    } catch (e) {
      console.error('Invalid URL:', path)
      return path
    }
  }

  // 如果是相对路径，使用环境变量中的基础URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || `http://localhost:${process.env.NEXT_PUBLIC_PORT || '3000'}`
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
} 