export interface MediaAssetBase {
  id: string
  name: string
  description: string
  type: string
  category: string
  subCategory?: string
  tags?: string[]
  status: 'Active' | 'Archived' | 'Deleted'
  path: string
  size: number
  mimeType: string
  metadata?: Record<string, any>
  downloads: number
  createdAt: string
  updatedAt: string
}

export interface MediaVersionBase {
  id: string
  assetId: string
  version: string
  path: string
  size: number
  changelog?: string
  createdAt: string
}

export interface MediaUsageBase {
  id: string
  assetId: string
  entityType: string
  entityId: string
  createdAt: string
}

export interface MediaPropertyBase {
  id: string
  assetId: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export interface MediaCategoryBase {
  id: string
  name: string
  description?: string
  parentId?: string
  status: 'Active' | 'Archived'
  createdAt: string
  updatedAt: string
}

// API Response types
export interface MediaAsset extends MediaAssetBase {
  versions: MediaVersion[]
  usages: MediaUsage[]
  properties: MediaProperty[]
}

export interface MediaVersion extends MediaVersionBase {
  asset: MediaAsset
}

export interface MediaUsage extends MediaUsageBase {
  asset: MediaAsset
}

export interface MediaProperty extends MediaPropertyBase {
  asset: MediaAsset
}

// API Request types
export interface CreateMediaAssetDTO {
  name: string
  description: string
  type: string
  category: string
  subCategory?: string
  tags?: string[]
  file: File
  metadata?: Record<string, any>
}

export interface UpdateMediaAssetDTO {
  name?: string
  description?: string
  category?: string
  subCategory?: string
  tags?: string[]
  status?: 'Active' | 'Archived' | 'Deleted'
  metadata?: Record<string, any>
}

export interface CreateMediaVersionDTO {
  assetId: string
  version: string
  file: File
  changelog?: string
}

export interface CreateMediaPropertyDTO {
  assetId: string
  key: string
  value: string
}

export interface CreateMediaCategoryDTO {
  name: string
  description?: string
  parentId?: string
}

export interface UpdateMediaCategoryDTO {
  name?: string
  description?: string
  parentId?: string
  status?: 'Active' | 'Archived'
}

// Search and Filter types
export interface MediaSearchParams {
  search?: string
  type?: string
  category?: string
  subCategory?: string
  tags?: string[]
  status?: 'Active' | 'Archived' | 'Deleted'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface MediaCategory extends MediaCategoryBase {
  // Add any additional properties for the API response
} 