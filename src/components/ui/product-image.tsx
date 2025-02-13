import Image from 'next/image'
import { useState } from 'react'

const DEFAULT_PRODUCT_IMAGE = '/images/no-image.png'

interface ProductImageProps {
  src: string | string[] | null | undefined
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
}

export function ProductImage({
  src,
  alt,
  className = '',
  width,
  height,
  fill = false,
  sizes
}: ProductImageProps) {
  const [error, setError] = useState(false)

  const getImageUrl = (): string => {
    if (error) return DEFAULT_PRODUCT_IMAGE
    
    if (!src) return DEFAULT_PRODUCT_IMAGE
    
    if (Array.isArray(src)) {
      return src.length > 0 ? src[0] : DEFAULT_PRODUCT_IMAGE
    }
    
    if (typeof src === 'string') {
      try {
        // 检查是否是 JSON 字符串
        if (src.startsWith('[')) {
          const images = JSON.parse(src)
          return Array.isArray(images) && images.length > 0 ? images[0] : DEFAULT_PRODUCT_IMAGE
        }
        return src
      } catch {
        return src
      }
    }
    
    return DEFAULT_PRODUCT_IMAGE
  }

  const imageProps = {
    src: getImageUrl(),
    alt,
    className,
    onError: () => setError(true),
    ...(fill ? { fill: true, sizes } : { width, height })
  }

  return <Image {...imageProps} />
} 