import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Grid, TextField, Button,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
  CircularProgress, Typography
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import { movementService } from '../services/movementService'
import { productService } from '@/modules/products/services/productService'
import type { ProductResponse } from '@/modules/products/types/product.types'

const schema = z.object({
  productId: z.coerce.number().min(1, 'Selecciona un producto'),
  type: z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT'], { required_error: 'Selecciona el tipo' }),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1'),
  reason: z.string().min(1, 'El motivo es obligatorio').max(255),
})
type FormData = z.infer<typeof schema>

export default function MovementFormPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<ProductResponse[]>([])

  const {
    register, handleSubmit, control, watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedProductId = watch('productId')
  const selectedProduct = products.find((p) => p.id === Number(selectedProductId))

  useEffect(() => {
    productService.findAll({ active: true, size: 200 })
      .then((r) => setProducts(r.content))
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await movementService.register(data)
      toast.success('Movimiento registrado correctamente')
      navigate('/movements')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al registrar el movimiento')
    }
  }

  return (
    <Box>
      <PageHeader title="Registrar Movimiento" subtitle="Registra una entrada, salida o ajuste de inventario" />
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Controller name="productId" control={control} render={({ field }) => (
                  <FormControl fullWidth error={!!errors.productId}>
                    <InputLabel>Producto *</InputLabel>
                    <Select {...field} label="Producto *" value={field.value || ''}>
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name} — <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                            Stock: {p.stock}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.productId?.message}</FormHelperText>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller name="type" control={control} render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel>Tipo *</InputLabel>
                    <Select {...field} label="Tipo *" value={field.value || ''}>
                      <MenuItem value="ENTRY">Entrada</MenuItem>
                      <MenuItem value="EXIT">Salida</MenuItem>
                      <MenuItem value="ADJUSTMENT">Ajuste</MenuItem>
                    </Select>
                    <FormHelperText>{errors.type?.message}</FormHelperText>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField {...register('quantity')} label="Cantidad *" type="number"
                  fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField {...register('reason')} label="Motivo *" fullWidth
                  error={!!errors.reason} helperText={errors.reason?.message} />
              </Grid>

              {selectedProduct && (
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" color="text.secondary">
                      Stock actual de <strong>{selectedProduct.name}</strong>: {' '}
                      <Typography component="span" fontWeight={700} color={selectedProduct.lowStock ? 'warning.main' : 'success.main'}>
                        {selectedProduct.stock} unidades
                      </Typography>
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Box display="flex" gap={2} mt={4}>
              <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/movements')}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Registrar Movimiento'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}