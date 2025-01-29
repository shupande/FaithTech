import apiClient from '../api-client'
import type {
  PaginatedResponse,
  ApiResponse,
  Product,
  Solution,
  Service,
  News,
  FAQ,
  Download,
  Legal,
  Page,
  MenuItem,
  CodeInjection,
} from './types'

// Products API
export const ProductsAPI = {
  list: (params?: {
    page?: number
    perPage?: number
    search?: string
    category?: string
    status?: string
  }) => apiClient.get<PaginatedResponse<Product>>('/api/products', { params }),
  
  get: (id: string) => apiClient.get<ApiResponse<Product>>(`/api/products/${id}`),
  
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<Product>>('/api/products', data),
  
  update: (id: string, data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/api/products/${id}`),
}

// Solutions API
export const SolutionsAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<Solution>>('/solutions', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<Solution>>(`/solutions/${id}`),
  
  create: (data: Omit<Solution, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<Solution>>('/solutions', data),
  
  update: (id: string, data: Partial<Solution>) => 
    apiClient.put<ApiResponse<Solution>>(`/solutions/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/solutions/${id}`),
}

// Services API
export const ServicesAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<Service>>('/services', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<Service>>(`/services/${id}`),
  
  create: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<Service>>('/services', data),
  
  update: (id: string, data: Partial<Service>) => 
    apiClient.put<ApiResponse<Service>>(`/services/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/services/${id}`),
}

// News API
export const NewsAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<News>>('/news', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<News>>(`/news/${id}`),
  
  create: (data: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => 
    apiClient.post<ApiResponse<News>>('/news', data),
  
  update: (id: string, data: Partial<News>) => 
    apiClient.put<ApiResponse<News>>(`/news/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/news/${id}`),
}

// FAQ API
export const FAQAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<FAQ>>('/faqs', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<FAQ>>(`/faqs/${id}`),
  
  create: (data: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<FAQ>>('/faqs', data),
  
  update: (id: string, data: Partial<FAQ>) => 
    apiClient.put<ApiResponse<FAQ>>(`/faqs/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/faqs/${id}`),
  
  reorder: (items: Array<{ id: string; order: number }>) =>
    apiClient.post<ApiResponse<void>>('/faqs/reorder', { items }),
}

// Downloads API
export const DownloadsAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<Download>>('/downloads', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<Download>>(`/downloads/${id}`),
  
  create: (data: Omit<Download, 'id' | 'createdAt' | 'updatedAt' | 'downloads'>) => 
    apiClient.post<ApiResponse<Download>>('/downloads', data),
  
  update: (id: string, data: Partial<Download>) => 
    apiClient.put<ApiResponse<Download>>(`/downloads/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/downloads/${id}`),
  
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<{ url: string }>>('/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Legal API
export const LegalAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<Legal>>('/legal', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<Legal>>(`/legal/${id}`),
  
  create: (data: Omit<Legal, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<Legal>>('/legal', data),
  
  update: (id: string, data: Partial<Legal>) => 
    apiClient.put<ApiResponse<Legal>>(`/legal/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/legal/${id}`),
}

// Pages API
export const PagesAPI = {
  list: (params?: any) => 
    apiClient.get<PaginatedResponse<Page>>('/pages', { params }),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<Page>>(`/pages/${id}`),
  
  create: (data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<Page>>('/pages', data),
  
  update: (id: string, data: Partial<Page>) => 
    apiClient.put<ApiResponse<Page>>(`/pages/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/pages/${id}`),
  
  setHomePage: (id: string) =>
    apiClient.post<ApiResponse<void>>(`/pages/${id}/set-home`),
}

// Navigation API
export const NavigationAPI = {
  list: () => 
    apiClient.get<ApiResponse<MenuItem[]>>('/navigation'),
  
  get: (id: string) => 
    apiClient.get<ApiResponse<MenuItem>>(`/navigation/${id}`),
  
  create: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<MenuItem>>('/navigation', data),
  
  update: (id: string, data: Partial<MenuItem>) => 
    apiClient.put<ApiResponse<MenuItem>>(`/navigation/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete<ApiResponse<void>>(`/navigation/${id}`),
  
  reorder: (items: Array<{ id: string; order: number; parentId: string | null }>) =>
    apiClient.post<ApiResponse<void>>('/navigation/reorder', { items }),
}

// Settings API
export const SettingsAPI = {
  getCodeInjection: () =>
    apiClient.get<ApiResponse<CodeInjection>>('/settings/code-injection'),
  
  updateCodeInjection: (data: Omit<CodeInjection, 'updatedAt'>) =>
    apiClient.put<ApiResponse<CodeInjection>>('/settings/code-injection', data),
  
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return apiClient.post<ApiResponse<{ url: string }>>('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Upload API
export const UploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<{
      url: string
      name: string
      size: number
    }>>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
} 