import { Chip } from '@mui/material'

interface Props {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusChip({
  active,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}: Props) {
  return (
    <Chip
      label={active ? activeLabel : inactiveLabel}
      color={active ? 'success' : 'default'}
      size="small"
      variant={active ? 'filled' : 'outlined'}
    />
  )
}