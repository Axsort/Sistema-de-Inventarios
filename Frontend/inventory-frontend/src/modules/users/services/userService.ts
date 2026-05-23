import api from '@/shared/services/axiosInstance'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { UserRequest, UserResponse } from '../types/user.types'

export const userService = {
  findAll: async (params = {}) => {
    const res = await api.get<ApiResponse<PageResponse<UserResponse>>>('/users', { params })
    return res.data.data
  },
  create: async (data: UserRequest) => {
    const res = await api.post<ApiResponse<UserResponse>>('/users', data)
    return res.data.data
  },
  update: async (id: number, data: UserRequest) => {
    const res = await api.put<ApiResponse<UserResponse>>(`/users/${id}`, data)
    return res.data.data
  },
  toggleStatus: async (id: number) => { await api.patch(`/users/${id}/status`) },
}