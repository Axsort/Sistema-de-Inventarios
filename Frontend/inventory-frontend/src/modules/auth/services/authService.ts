import api from '@/shared/services/axiosInstance'
import type { LoginRequest, AuthResponse } from '../types/auth.types'
import type { ApiResponse } from '@/shared/types/api.types'

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return res.data.data
  },
}