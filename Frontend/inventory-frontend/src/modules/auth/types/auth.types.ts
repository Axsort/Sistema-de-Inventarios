export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  userId: number
  name: string
  email: string
  role: string
}

export interface AuthUser {
  userId: number
  name: string
  email: string
  role: string
  token: string
}