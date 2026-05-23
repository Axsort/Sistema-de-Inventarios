import { useEffect, useState } from 'react'
import { Grid, Box, Skeleton, Alert } from '@mui/material'
import {
  Inventory2, WarningAmber, LocalShipping, SwapHoriz
} from '@mui/icons-material'
import MetricCard from '../components/MetricCard'
import StockChart from '../components/StockChart'
import RecentMovementsTable from '../components/RecentMovementsTable'
import { dashboardService } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard.types'

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    dashboardService.getSummary()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <Alert severity="error">No se pudo cargar el dashboard.</Alert>

  return (
    <Box>
      {/* Métricas */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            title: 'Total Productos',
            value: data?.totalProducts ?? 0,
            icon: <Inventory2 />,
            color: '#1e40af',
            subtitle: 'Productos activos',
          },
          {
            title: 'Stock Bajo',
            value: data?.lowStockProducts ?? 0,
            icon: <WarningAmber />,
            color: '#d97706',
            subtitle: 'Requieren atención',
          },
          {
            title: 'Proveedores',
            value: data?.totalSuppliers ?? 0,
            icon: <LocalShipping />,
            color: '#059669',
            subtitle: 'Proveedores activos',
          },
          {
            title: 'Movimientos Hoy',
            value: data?.totalMovementsToday ?? 0,
            icon: <SwapHoriz />,
            color: '#7c3aed',
            subtitle: 'Entradas, salidas y ajustes',
          },
        ].map((card) => (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            {loading ? (
              <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
            ) : (
              <MetricCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Gráfico + Movimientos recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          {loading ? (
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
          ) : (
            <StockChart data={data?.movementsByType ?? {}} />
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          {loading ? (
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
          ) : (
            <RecentMovementsTable movements={data?.recentMovements ?? []} />
          )}
        </Grid>
      </Grid>
    </Box>
  )
}