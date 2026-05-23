import api from '@/shared/services/axiosInstance'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { SupplierRequest, SupplierResponse } from '../types/supplier.types'

export const supplierService = {
  findAll: async (params = {}): Promise<PageResponse<SupplierResponse>> => {
    const res = await api.get<ApiResponse<PageResponse<SupplierResponse>>>('/suppliers', { params })
    return res.data.data
  },
  create: async (data: SupplierRequest) => {
    const res = await api.post<ApiResponse<SupplierResponse>>('/suppliers', data)
    return res.data.data
  },
  update: async (id: number, data: SupplierRequest) => {
    const res = await api.put<ApiResponse<SupplierResponse>>(`/suppliers/${id}`, data)
    return res.data.data
  },
  toggleStatus: async (id: number) => { await api.patch(`/suppliers/${id}/status`) },
}