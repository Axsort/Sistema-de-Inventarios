import api from '@/shared/services/axiosInstance'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { ProductRequest, ProductResponse } from '../types/product.types'

interface ProductFilters {
  search?: string
  categoryId?: number
  active?: boolean
  page?: number
  size?: number
}

export const productService = {
  findAll: async (filters: ProductFilters = {}): Promise<PageResponse<ProductResponse>> => {
    const res = await api.get<ApiResponse<PageResponse<ProductResponse>>>('/products', {
      params: filters,
    })
    return res.data.data
  },

  findById: async (id: number): Promise<ProductResponse> => {
    const res = await api.get<ApiResponse<ProductResponse>>(`/products/${id}`)
    return res.data.data
  },

  findLowStock: async (): Promise<ProductResponse[]> => {
    const res = await api.get<ApiResponse<ProductResponse[]>>('/products/low-stock')
    return res.data.data
  },

  create: async (data: ProductRequest): Promise<ProductResponse> => {
    const res = await api.post<ApiResponse<ProductResponse>>('/products', data)
    return res.data.data
  },

  update: async (id: number, data: ProductRequest): Promise<ProductResponse> => {
    const res = await api.put<ApiResponse<ProductResponse>>(`/products/${id}`, data)
    return res.data.data
  },

  toggleStatus: async (id: number): Promise<void> => {
    await api.patch(`/products/${id}/status`)
  },
}