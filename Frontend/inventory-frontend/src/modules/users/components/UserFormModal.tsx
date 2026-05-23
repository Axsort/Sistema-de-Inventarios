import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, FormControl, InputLabel,
  Select, MenuItem, FormHelperText, CircularProgress
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { userService } from '../services/userService'
import type { UserResponse } from '../types/user.types'

const schema = z.object({
  name: z.string().min(1, 'Nombre obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').or(z.literal('')),
  role: z.enum(['ADMIN', 'EMPLOYEE']),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  user: UserResponse | null
  onClose: () => void
  onSuccess: () => void
}

export default function UserFormModal({ open, user, onClose, onSuccess }: Props) {
  const isEdit = !!user
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(user
        ? { name: user.name, email: user.email, password: '', role: user.role as 'ADMIN' | 'EMPLOYEE' }
        : { name: '', email: '', password: '', role: 'EMPLOYEE' }
      )
    }
  }, [open, user, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await userService.update(user.id, data)
        toast.success('Usuario actualizado')
      } else {
        await userService.create(data)
        toast.success('Usuario creado')
      }
      onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField {...register('name')} label="Nombre *" fullWidth margin="normal"
            error={!!errors.name} helperText={errors.name?.message} />
          <TextField {...register('email')} label="Email *" fullWidth margin="normal"
            error={!!errors.email} helperText={errors.email?.message} />
          <TextField {...register('password')} label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
            type="password" fullWidth margin="normal"
            error={!!errors.password} helperText={errors.password?.message} />
          <Controller name="role" control={control} render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>Rol *</InputLabel>
              <Select {...field} label="Rol *">
                <MenuItem value="ADMIN">Administrador</MenuItem>
                <MenuItem value="EMPLOYEE">Empleado</MenuItem>
              </Select>
              <FormHelperText>{errors.role?.message}</FormHelperText>
            </FormControl>
          )} />
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