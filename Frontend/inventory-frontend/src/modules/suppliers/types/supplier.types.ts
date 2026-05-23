export interface SupplierResponse {
  id: number; name: string; phone?: string; email?: string
  address?: string; contactName?: string; active: boolean; createdAt: string
}
export interface SupplierRequest {
  name: string; phone?: string; email?: string; address?: string; contactName?: string
}