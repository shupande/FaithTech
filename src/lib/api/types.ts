export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    currentPage: number
    lastPage: number
    perPage: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: string
  status: 'Active' | 'Coming Soon' | 'Discontinued'
  description: string
  images: Array<{
    url: string
    alt: string
  }>
  files?: Array<{
    name: string
    url: string
    size: number
  }>
  createdAt: string
  updatedAt: string
}

export interface Solution {
  id: string
  title: string
  category: string
  status: 'Featured' | 'Active' | 'Draft'
  summary: string
  content: string
  coverImage?: string
  features: Array<{
    title: string
    description: string
  }>
  caseStudies: Array<{
    title: string
    description: string
    result: string
  }>
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  name: string
  type: string
  team: string
  availability: 'Available' | 'Limited' | 'By Request'
  description: string
  deliverables: string[]
  requirements: string[]
  createdAt: string
  updatedAt: string
}

export interface News {
  id: string
  title: string
  category: string
  publishDate: string
  status: 'Published' | 'Draft'
  author: string
  content: string
  excerpt: string
  coverImage?: string
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  status: 'Published' | 'Draft'
  createdAt: string
  updatedAt: string
}

export interface Download {
  id: string
  title: string
  description: string
  category: string
  version: string
  file: {
    name: string
    url: string
    size: number
    format: string
  }
  status: 'Active' | 'Archived'
  downloads: number
  createdAt: string
  updatedAt: string
}

export interface Legal {
  id: string
  title: string
  type: string
  content: string
  status: 'Published' | 'Draft'
  effectiveDate: string
  version: string
  metadata: {
    author: string
    reviewedBy: string
    approvedBy: string
    lastReviewDate: string
  }
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  path: string
  type: string
  content: string
  status: 'Published' | 'Draft'
  isHomePage: boolean
  seo: {
    title: string
    description: string
    keywords: string
    ogImage: string
  }
  settings: {
    showInNavigation: boolean
    allowComments: boolean
    password: string
  }
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  title: string
  path: string
  order: number
  parentId: string | null
  isVisible: boolean
  isExpanded: boolean
  children?: MenuItem[]
  createdAt: string
  updatedAt: string
}

export interface CodeInjection {
  headerCode: string
  footerCode: string
  updatedAt: string
} 