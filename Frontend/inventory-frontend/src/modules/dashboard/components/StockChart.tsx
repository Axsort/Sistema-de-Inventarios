import { Card, CardContent, Typography } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface Props {
  data: Record<string, number>
}

const LABELS: Record<string, string> = {
  ENTRY: 'Entradas',
  EXIT: 'Salidas',
  ADJUSTMENT: 'Ajustes',
}

const COLORS: Record<string, string> = {
  ENTRY: '#059669',
  EXIT: '#dc2626',
  ADJUSTMENT: '#d97706',
}

export default function StockChart({ data }: Props) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: LABELS[key] ?? key,
    value,
    color: COLORS[key] ?? '#64748b',
  }))

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Movimientos (últimos 30 días)
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis tick={{ fontSize: 13 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" name="Movimientos" radius={[6, 6, 0, 0]}
              fill="#1e40af"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}