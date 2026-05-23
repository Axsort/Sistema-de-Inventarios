import api from '@/shared/services/axiosInstance'
import type { ApiResponse } from '@/shared/types/api.types'
import type { CategoryRequest, CategoryResponse } from '../types/category.types'

export const categoryService = {
  findAll: async (): Promise<CategoryResponse[]> => {
    const res = await api.get<ApiResponse<CategoryResponse[]>>('/categories')
    return res.data.data
  },

  findAllActive: async (): Promise<CategoryResponse[]> => {
    const res = await api.get<ApiResponse<CategoryResponse[]>>('/categories/active')
    return res.data.data
  },

  create: async (data: CategoryRequest): Promise<CategoryResponse> => {
    const res = await api.post<ApiResponse<CategoryResponse>>('/categories', data)
    return res.data.data
  },

  update: async (id: number, data: CategoryRequest): Promise<CategoryResponse> => {
    const res = await api.put<ApiResponse<CategoryResponse>>(`/categories/${id}`, data)
    return res.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`)
  },
}