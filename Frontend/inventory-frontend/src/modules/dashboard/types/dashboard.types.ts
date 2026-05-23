import type { MovementResponse } from '@/modules/movements/types/movement.types'

export interface DashboardData {
  totalProducts: number
  lowStockProducts: number
  totalSuppliers: number
  totalMovementsToday: number
  recentMovements: MovementResponse[]
  movementsByType: Record<string, number>
}