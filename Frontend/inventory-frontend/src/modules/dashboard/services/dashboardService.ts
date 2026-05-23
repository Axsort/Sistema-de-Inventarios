import api from '@/shared/services/axiosInstance'
import type { ApiResponse } from '@/shared/types/api.types'
import type { DashboardData } from '../types/dashboard.types'

export const dashboardService = {
  getSummary: async (): Promise<DashboardData> => {
    const res = await api.get<ApiResponse<DashboardData>>('/dashboard/summary')
    return res.data.data
  },
}