import { useEffect, useState } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Typography, Alert
} from '@mui/material'
import { WarningAmber } from '@mui/icons-material'
import PageHeader from '@/shared/components/ui/PageHeader'
import EmptyState from '@/shared/components/ui/EmptyState'
import { productService } from '../services/productService'
import type { ProductResponse } from '../types/product.types'
import { formatCurrency } from '@/shared/utils/formatters'

export default function LowStockPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.findLowStock()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box>
      <PageHeader
        title="Alertas de Stock Bajo"
        subtitle="Productos que han alcanzado o superado su stock mínimo"
      />

      {!loading && products.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningAmber />}>
          Hay <strong>{products.length} productos</strong> con stock bajo que requieren atención.
        </Alert>
      )}

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell align="center">Stock Actual</TableCell>
                <TableCell align="center">Stock Mínimo</TableCell>
                <TableCell align="right">Precio Venta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>Cargando...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState message="Sin alertas" description="Todos los productos tienen stock suficiente." />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontFamily="monospace">{p.sku}</Typography>
                    </TableCell>
                    <TableCell><Chip label={p.category?.name} size="small" /></TableCell>
                    <TableCell>{p.supplier?.name}</TableCell>
                    <TableCell align="center">
                      <Chip label={p.stock} size="small" color="error" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={p.minStock} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(p.salePrice)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}