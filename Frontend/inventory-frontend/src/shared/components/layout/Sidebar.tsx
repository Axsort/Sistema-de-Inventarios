import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Box, Typography, Divider, Avatar
} from '@mui/material'
import {
  Dashboard, Inventory2, Category, LocalShipping,
  SwapHoriz, People, WarningAmber
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authStore'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/' },
  { label: 'Productos', icon: <Inventory2 />, path: '/products' },
  { label: 'Categorías', icon: <Category />, path: '/categories' },
  { label: 'Proveedores', icon: <LocalShipping />, path: '/suppliers' },
  { label: 'Movimientos', icon: <SwapHoriz />, path: '/movements' },
  { label: 'Stock Bajo', icon: <WarningAmber />, path: '/low-stock' },
]

const adminItems = [
  { label: 'Usuarios', icon: <People />, path: '/users' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
          color: '#fff',
          border: 'none',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={800} color="#fff" letterSpacing={0.5}>
          📦 Inventario
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Sistema de Gestión
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

      {/* User info */}
      <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#3b82f6', fontSize: 14 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} color="#fff" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            {user?.role}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 1 }} />

      {/* Nav */}
      <List dense sx={{ px: 1 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                  bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 20 } }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}

        {user?.role === 'ADMIN' && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 1 }} />
            <Typography
              variant="caption"
              sx={{ px: 2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Admin
            </Typography>
            {adminItems.map(({ label, icon, path }) => {
              const active = location.pathname === path
              return (
                <ListItem key={path} disablePadding sx={{ mb: 0.5, mt: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(path)}
                    sx={{
                      borderRadius: 2,
                      color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                      bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
                      py: 1,
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 20 } }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </>
        )}
      </List>
    </Drawer>
  )
}