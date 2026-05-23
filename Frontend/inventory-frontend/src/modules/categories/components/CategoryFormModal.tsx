import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, CircularProgress
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { categoryService } from '../services/categoryService'
import type { CategoryResponse } from '../types/category.types'

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  description: z.string().max(255).optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  category: CategoryResponse | null
  onClose: () => void
  onSuccess: () => void
}

export default function CategoryFormModal({ open, category, onClose, onSuccess }: Props) {
  const isEdit = !!category
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(category
        ? { name: category.name, description: category.description ?? '' }
        : { name: '', description: '' }
      )
    }
  }, [open, category, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await categoryService.update(category.id, data)
        toast.success('Categoría actualizada')
      } else {
        await categoryService.create(data)
        toast.success('Categoría creada')
      }
      onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>
        {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField {...register('name')} label="Nombre *" fullWidth margin="normal"
            error={!!errors.name} helperText={errors.name?.message} autoFocus />
          <TextField {...register('description')} label="Descripción" fullWidth margin="normal"
            multiline rows={2} error={!!errors.description}
            helperText={errors.description?.message} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}