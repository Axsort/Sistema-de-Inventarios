import api from '@/shared/services/axiosInstance'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { MovementRequest, MovementResponse } from '../types/movement.types'
import type { MovementType } from '@/shared/types/common.types'

export const movementService = {
  findAll: async (params: { productId?: number; type?: MovementType; page?: number; size?: number } = {}) => {
    const res = await api.get<ApiResponse<PageResponse<MovementResponse>>>('/inventory-movements', { params })
    return res.data.data
  },
  register: async (data: MovementRequest) => {
    const res = await api.post<ApiResponse<MovementResponse>>('/inventory-movements', data)
    return res.data.data
  },
}