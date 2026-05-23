import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column"
      alignItems="center" justifyContent="center" bgcolor="background.default">
      <Typography variant="h1" fontWeight={900} color="primary.main" lineHeight={1}>
        404
      </Typography>
      <Typography variant="h5" fontWeight={700} mt={2}>Página no encontrada</Typography>
      <Typography variant="body1" color="text.secondary" mt={1} mb={4}>
        La ruta que buscas no existe.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Volver al Dashboard
      </Button>
    </Box>
  )
}