import { useEffect, useState, useCallback } from 'react'
import {
  Box, Card, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, TablePagination,
  IconButton, Tooltip, Chip, Typography, InputAdornment
} from '@mui/material'
import {
  Add, Edit, PowerSettingsNew, Search, WarningAmber
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import StatusChip from '@/shared/components/ui/StatusChip'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog'
import EmptyState from '@/shared/components/ui/EmptyState'
import { productService } from '../services/productService'
import { categoryService } from '@/modules/categories/services/categoryService'
import type { ProductResponse } from '../types/product.types'
import type { CategoryResponse } from '@/modules/categories/types/category.types'
import { formatCurrency } from '@/shared/utils/formatters'
import { useDebounce } from '@/shared/hooks/useDebounce'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 400)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productService.findAll({
        search: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        active: activeFilter === '' ? undefined : activeFilter === 'true',
        page,
        size: rowsPerPage,
      })
      setProducts(res.content)
      setTotalElements(res.totalElements)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, categoryId, activeFilter, page, rowsPerPage])

  useEffect(() => { loadProducts() }, [loadProducts])

  useEffect(() => {
    categoryService.findAll().then(setCategories)
  }, [])

  const handleToggleStatus = async () => {
    if (!confirmId) return
    try {
      await productService.toggleStatus(confirmId)
      toast.success('Estado del producto actualizado')
      loadProducts()
    } catch {
      toast.error('No se pudo cambiar el estado')
    } finally {
      setConfirmId(null)
    }
  }

  return (
    <Box>
      <PageHeader
        title="Productos"
        subtitle={`${totalElements} productos encontrados`}
        action={{ label: 'Nuevo Producto', icon: <Add />, onClick: () => navigate('/products/new') }}
      />

      {/* Filtros */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth size="small" placeholder="Buscar por nombre o SKU..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryId}
                label="Categoría"
                onChange={(e) => { setCategoryId(e.target.value as number | ''); setPage(0) }}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={activeFilter}
                label="Estado"
                onChange={(e) => { setActiveFilter(e.target.value); setPage(0) }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Tabla */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Precio Venta</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}><Box sx={{ height: 20, bgcolor: '#f1f5f9', borderRadius: 1 }} /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}><EmptyState /></TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                          {p.description && (
                            <Typography variant="caption" color="text.secondary" noWrap
                              sx={{ maxWidth: 200, display: 'block' }}>
                              {p.description}
                            </Typography>
                          )}
                        </Box>
                        {p.lowStock && (
                          <Tooltip title="Stock bajo">
                            <WarningAmber color="warning" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace"
                        bgcolor="#f1f5f9" px={1} py={0.3} borderRadius={1}>
                        {p.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={p.category?.name} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(p.salePrice)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={p.stock}
                        size="small"
                        color={p.lowStock ? 'warning' : 'default'}
                        variant={p.lowStock ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell><StatusChip active={p.active} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => navigate(`/products/${p.id}/edit`)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={p.active ? 'Desactivar' : 'Activar'}>
                        <IconButton size="small" onClick={() => setConfirmId(p.id)}
                          color={p.active ? 'error' : 'success'}>
                          <PowerSettingsNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>

      <ConfirmDialog
        open={confirmId !== null}
        title="Cambiar estado del producto"
        message="¿Confirmas que deseas cambiar el estado de este producto?"
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmId(null)}
        confirmColor="warning"
      />
    </Box>
  )
}