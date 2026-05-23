import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@mui/material'

interface Props {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmColor?: 'error' | 'primary' | 'warning'
}

export default function ConfirmDialog({
  open, title, message, onConfirm, onCancel, confirmColor = 'error'
}: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color={confirmColor}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}