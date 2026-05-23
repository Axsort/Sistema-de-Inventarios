import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authStore'

interface Props {
  allowedRoles: string[]
}

export default function RoleGuard({ allowedRoles }: Props) {
  const user = useAuthStore((s) => s.user)
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}