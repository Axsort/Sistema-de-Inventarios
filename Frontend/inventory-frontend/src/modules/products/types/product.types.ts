import type { CategoryResponse } from '@/modules/categories/types/category.types'
import type { SupplierResponse } from '@/modules/suppliers/types/supplier.types'

export interface ProductResponse {
  id: number
  name: string
  description?: string
  sku: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  lowStock: boolean
  category: CategoryResponse
  supplier: SupplierResponse
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  name: string
  description?: string
  sku: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  categoryId: number
  supplierId: number
}