import { useEffect, useState, useCallback } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Chip, Typography,
  FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/shared/components/ui/PageHeader'
import EmptyState from '@/shared/components/ui/EmptyState'
import { movementService } from '../services/movementService'
import type { MovementResponse } from '../types/movement.types'
import type { MovementType } from '@/shared/types/common.types'
import { formatDateTime } from '@/shared/utils/formatters'

const TYPE_CONFIG = {
  ENTRY:      { label: 'Entrada',  color: 'success' as const },
  EXIT:       { label: 'Salida',   color: 'error'   as const },
  ADJUSTMENT: { label: 'Ajuste',   color: 'warning' as const },
}

export default function MovementsPage() {
  const navigate = useNavigate()
  const [movements, setMovements] = useState<MovementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [typeFilter, setTypeFilter] = useState<MovementType | ''>('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await movementService.findAll({
        type: typeFilter || undefined, page, size: rowsPerPage,
      })
      setMovements(res.content)
      setTotalElements(res.totalElements)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, page, rowsPerPage])

  useEffect(() => { load() }, [load])

  return (
    <Box>
      <PageHeader
        title="Movimientos de Inventario"
        subtitle="Historial de entradas, salidas y ajustes"
        action={{ label: 'Registrar Movimiento', icon: <Add />, onClick: () => navigate('/movements/new') }}
      />

      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select value={typeFilter} label="Tipo"
                onChange={(e) => { setTypeFilter(e.target.value as MovementType | ''); setPage(0) }}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ENTRY">Entradas</MenuItem>
                <MenuItem value="EXIT">Salidas</MenuItem>
                <MenuItem value="ADJUSTMENT">Ajustes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="center">Cantidad</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>Cargando...</TableCell></TableRow>
              ) : movements.length === 0 ? (
                <TableRow><TableCell colSpan={6}><EmptyState /></TableCell></TableRow>
              ) : (
                movements.map((m) => {
                  const cfg = TYPE_CONFIG[m.type]
                  return (
                    <TableRow key={m.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{m.productName}</Typography>
                        <Typography variant="caption" color="text.secondary" fontFamily="monospace">{m.productSku}</Typography>
                      </TableCell>
                      <TableCell><Chip label={cfg.label} color={cfg.color} size="small" /></TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={700}>{m.quantity}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{m.reason}</Typography>
                      </TableCell>
                      <TableCell>{m.userName}</TableCell>
                      <TableCell>
                        <Typography variant="caption">{formatDateTime(m.createdAt)}</Typography>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={totalElements} page={page}
          onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>
    </Box>
  )
}