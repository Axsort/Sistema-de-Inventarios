import { useState } from 'react'
import {
  Box, Card, CardContent, TextField, Button,
  Typography, InputAdornment, IconButton, CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff, Inventory2 } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const auth = await authService.login(data)
      setUser(auth)
      toast.success(`Bienvenido, ${auth.name}`)
      navigate('/')
    } catch {
      toast.error('Credenciales incorrectas. Verifica tu email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setValue('email', 'admin@inventory.com')
    setValue('password', 'admin123')
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: 3,
                bgcolor: 'primary.main',
                mb: 2,
              }}
            >
              <Inventory2 sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} color="text.primary">
              Sistema de Inventario
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Inicia sesión para continuar
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              autoFocus
            />
            <TextField
              {...register('password')}
              label="Contraseña"
              type={showPass ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
          </Box>

          {/* Demo box */}
          <Box
            sx={{
              mt: 3,
              p: 1.5,
              bgcolor: 'grey.100',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" fontWeight={600}>
              🔑 Credenciales de demo
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              Email: <strong>admin@inventory.com</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              Contraseña: <strong>admin123</strong>
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={fillDemo}
              sx={{ mt: 1.5, textTransform: 'none', borderStyle: 'dashed' }}
            >
              Entrar como demo
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  )
}