import type { MovementType } from '@/shared/types/common.types'

export interface MovementResponse {
  id: number; productId: number; productName: string; productSku: string
  type: MovementType; quantity: number; reason: string
  userName: string; createdAt: string
}
export interface MovementRequest {
  productId: number; type: MovementType; quantity: number; reason: string
}