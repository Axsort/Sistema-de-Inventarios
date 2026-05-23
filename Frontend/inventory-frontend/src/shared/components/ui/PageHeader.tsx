import { Box, Typography, Button } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  action?: { label: string; icon?: ReactNode; onClick: () => void }
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ px: 2.5 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
}