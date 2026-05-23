import { Card, CardContent, Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: number | string
  icon: ReactNode
  color: string
  subtitle?: string
}

export default function MetricCard({ title, value, icon, color, subtitle }: Props) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              bgcolor: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              '& svg': { fontSize: 26 },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}