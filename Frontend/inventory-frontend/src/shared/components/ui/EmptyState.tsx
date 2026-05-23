import { Box, Typography } from '@mui/material'
import { InboxOutlined } from '@mui/icons-material'

interface Props {
  message?: string
  description?: string
}

export default function EmptyState({
  message = 'Sin resultados',
  description = 'No se encontraron registros con los filtros aplicados.',
}: Props) {
  return (
    <Box textAlign="center" py={6} color="text.secondary">
      <InboxOutlined sx={{ fontSize: 52, mb: 1, opacity: 0.4 }} />
      <Typography variant="body1" fontWeight={600}>{message}</Typography>
      <Typography variant="body2" mt={0.5}>{description}</Typography>
    </Box>
  )
}