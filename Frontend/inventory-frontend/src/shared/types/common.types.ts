export type RoleType = 'ADMIN' | 'EMPLOYEE'
export type MovementType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT'

export interface SelectOption {
  value: string | number
  label: string
}