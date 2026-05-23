export interface CategoryResponse {
  id: number
  name: string
  description?: string
  active: boolean
}

export interface CategoryRequest {
  name: string
  description?: string
}