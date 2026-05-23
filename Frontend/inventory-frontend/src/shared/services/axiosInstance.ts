import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/modules/auth/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — adjunta el token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      toast.error('Sesión expirada. Por favor inicia sesión nuevamente.')
    } else if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción.')
    } else if (status === 404) {
      toast.error(message || 'Recurso no encontrado.')
    } else if (status === 409) {
      toast.error(message || 'Ya existe un registro con esos datos.')
    } else if (status === 400) {
      // errores de validación — se manejan por formulario
    } else if (status >= 500) {
      toast.error('Error del servidor. Intenta nuevamente.')
    }

    return Promise.reject(error)
  }
)
import { applyMocks } from './mockAdapter'
applyMocks(api)

export default api
