'use client'

import * as React from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"

interface ProductImage {
  url: string
  alt: string
}

interface ProductImagesProps {
  images: ProductImage[]
}

export function ProductImages({ images }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = React.useState(0)

  return (
    <div className="space-y-4">
      <Card className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt}
          fill
          className="object-cover"
        />
      </Card>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${
              selectedImage === index ? 'border-blue-600' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
} 