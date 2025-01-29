export interface ProductFeature {
  icon: string
  title: string
  description: string
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductDocument {
  icon: string
  title: string
  description: string
  fileSize: string
  downloadUrl: string
}

export interface ProductModel {
  name: string
  description: string
  features: string[]
}

export interface Product {
  name: string
  description: string
  fullDescription: string
  features: ProductFeature[]
  specifications: ProductSpecification[]
  documents: ProductDocument[]
  models: ProductModel[]
  images: {
    url: string
    alt: string
  }[]
  price: string
}

export type Products = Record<string, Product> 