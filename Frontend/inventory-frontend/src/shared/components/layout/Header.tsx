import { AppBar, Toolbar, Typography, IconButton, Box, Chip, Tooltip } from '@mui/material'
import { Logout, NotificationsNone } from '@mui/icons-material'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Sesión cerrada correctamente')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderBottom: '1px solid #e2e8f0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={user?.role}
            size="small"
            color={user?.role === 'ADMIN' ? 'primary' : 'default'}
            variant="outlined"
          />
          <Tooltip title="Notificaciones">
            <IconButton size="small">
              <NotificationsNone fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar sesión">
            <IconButton size="small" onClick={handleLogout} color="error">
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}