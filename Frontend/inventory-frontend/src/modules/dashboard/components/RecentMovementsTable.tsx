import {
  Card, CardContent, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, Box
} from '@mui/material'
import type { MovementResponse } from '@/modules/movements/types/movement.types'
import { formatDateTime } from '@/shared/utils/formatters'

const TYPE_CONFIG = {
  ENTRY:      { label: 'Entrada',  color: 'success' as const },
  EXIT:       { label: 'Salida',   color: 'error'   as const },
  ADJUSTMENT: { label: 'Ajuste',   color: 'warning' as const },
}

interface Props { movements: MovementResponse[] }

export default function RecentMovementsTable({ movements }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Últimos Movimientos
        </Typography>
        {movements.length === 0 ? (
          <Box textAlign="center" py={3} color="text.secondary">
            <Typography variant="body2">Sin movimientos recientes</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Cant.</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((m) => {
                const cfg = TYPE_CONFIG[m.type]
                return (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{m.productName}</Typography>
                      <Typography variant="caption" color="text.secondary">{m.productSku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={cfg.label} color={cfg.color} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>{m.quantity}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(m.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}