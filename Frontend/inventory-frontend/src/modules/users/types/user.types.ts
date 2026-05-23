export interface UserResponse {
  id: number; name: string; email: string; role: string
  active: boolean; createdAt: string
}
export interface UserRequest {
  name: string; email: string; password: string; role: 'ADMIN' | 'EMPLOYEE'
}