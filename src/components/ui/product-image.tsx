import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function ProductImage({
  src,
  alt,
  width = 500,
  height = 500,
  priority = false,
  className,
}: ProductImageProps) {
  return (
    <Image
      src={getImageUrl(src)}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
} 