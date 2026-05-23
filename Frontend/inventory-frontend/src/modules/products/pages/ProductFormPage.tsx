import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Grid, TextField,
  Button, MenuItem, Select, FormControl, InputLabel,
  FormHelperText, CircularProgress, Typography, Divider
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import { productService } from '../services/productService'
import { categoryService } from '@/modules/categories/services/categoryService'
import { supplierService } from '@/modules/suppliers/services/supplierService'
import type { CategoryResponse } from '@/modules/categories/types/category.types'
import type { SupplierResponse } from '@/modules/suppliers/types/supplier.types'

const schema = z.object({
  name: z.string().min(1, 'Nombre obligatorio').max(150),
  description: z.string().max(500).optional(),
  sku: z.string().min(1, 'SKU obligatorio').max(50),
  purchasePrice: z.coerce.number().positive('Debe ser mayor a 0'),
  salePrice: z.coerce.number().positive('Debe ser mayor a 0'),
  stock: z.coerce.number().min(0, 'No puede ser negativo'),
  minStock: z.coerce.number().min(0, 'No puede ser negativo'),
  categoryId: z.coerce.number().min(1, 'Selecciona una categoría'),
  supplierId: z.coerce.number().min(1, 'Selecciona un proveedor'),
})
type FormData = z.infer<typeof schema>

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    categoryService.findAllActive().then(setCategories)
    supplierService.findAll({ page: 0, size: 100 })
      .then((r) => setSuppliers(r.content))
  }, [])

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      productService.findById(Number(id))
        .then((p) => reset({
          name: p.name, description: p.description,
          sku: p.sku, purchasePrice: p.purchasePrice,
          salePrice: p.salePrice, stock: p.stock,
          minStock: p.minStock, categoryId: p.category.id,
          supplierId: p.supplier.id,
        }))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await productService.update(Number(id), data)
        toast.success('Producto actualizado correctamente')
      } else {
        await productService.create(data)
        toast.success('Producto creado correctamente')
      }
      navigate('/products')
    } catch (err: any) {
      const msg = err.response?.data?.message
      if (err.response?.status === 400 && err.response?.data?.data) {
        Object.values(err.response.data.data).forEach((m) => toast.error(m as string))
      } else {
        toast.error(msg || 'Error al guardar el producto')
      }
    }
  }

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={8}>
      <CircularProgress />
    </Box>
  )

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        subtitle={isEdit ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
      />

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="subtitle1" fontWeight={700} mb={2} color="text.secondary">
              Información general
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={8}>
                <TextField {...register('name')} label="Nombre *" fullWidth
                  error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField {...register('sku')} label="SKU *" fullWidth
                  error={!!errors.sku} helperText={errors.sku?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField {...register('description')} label="Descripción" fullWidth
                  multiline rows={2} error={!!errors.description}
                  helperText={errors.description?.message} />
              </Grid>

              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={700} mb={0} color="text.secondary">
                  Precios y stock
                </Typography>
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField {...register('purchasePrice')} label="Precio Compra *"
                  type="number" fullWidth inputProps={{ step: '0.01' }}
                  error={!!errors.purchasePrice} helperText={errors.purchasePrice?.message} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField {...register('salePrice')} label="Precio Venta *"
                  type="number" fullWidth inputProps={{ step: '0.01' }}
                  error={!!errors.salePrice} helperText={errors.salePrice?.message} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField {...register('stock')} label="Stock Inicial *"
                  type="number" fullWidth
                  error={!!errors.stock} helperText={errors.stock?.message} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField {...register('minStock')} label="Stock Mínimo *"
                  type="number" fullWidth
                  error={!!errors.minStock} helperText={errors.minStock?.message} />
              </Grid>

              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={700} mb={0} color="text.secondary">
                  Clasificación
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.categoryId}>
                      <InputLabel>Categoría *</InputLabel>
                      <Select {...field} label="Categoría *" value={field.value || ''}>
                        {categories.map((c) => (
                          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.categoryId?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.supplierId}>
                      <InputLabel>Proveedor *</InputLabel>
                      <Select {...field} label="Proveedor *" value={field.value || ''}>
                        {suppliers.map((s) => (
                          <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.supplierId?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={4}>
              <Button variant="outlined" startIcon={<ArrowBack />}
                onClick={() => navigate('/products')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />}
                disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Guardar Producto'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}