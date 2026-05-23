import { Box } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Productos',
  '/products/new': 'Nuevo Producto',
  '/categories': 'Categorías',
  '/suppliers': 'Proveedores',
  '/movements': 'Movimientos de Inventario',
  '/low-stock': 'Alertas de Stock Bajo',
  '/users': 'Usuarios',
}

export default function AppLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Sistema de Inventario'

  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Header title={title} />
        <Box component="main" flex={1} p={3} overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}