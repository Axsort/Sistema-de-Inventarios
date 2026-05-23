import { useEffect, useState, useCallback } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton,
  Tooltip, Typography, Chip
} from '@mui/material'
import { Add, Edit, PowerSettingsNew } from '@mui/icons-material'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import StatusChip from '@/shared/components/ui/StatusChip'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog'
import EmptyState from '@/shared/components/ui/EmptyState'
import UserFormModal from '../components/UserFormModal'
import { userService } from '../services/userService'
import type { UserResponse } from '../types/user.types'
import { formatDateTime } from '@/shared/utils/formatters'

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserResponse | null>(null)
  const [toggleId, setToggleId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.findAll({ page, size: rowsPerPage })
      setUsers(res.content)
      setTotalElements(res.totalElements)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage])

  useEffect(() => { load() }, [load])

  const handleToggle = async () => {
    if (!toggleId) return
    try {
      await userService.toggleStatus(toggleId)
      toast.success('Estado del usuario actualizado')
      load()
    } catch { toast.error('No se pudo cambiar el estado') }
    finally { setToggleId(null) }
  }

  return (
    <Box>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de accesos al sistema"
        action={{ label: 'Nuevo Usuario', icon: <Add />,
          onClick: () => { setEditing(null); setModalOpen(true) } }}
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>Cargando...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={6}><EmptyState /></TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{u.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small"
                        color={u.role === 'ADMIN' ? 'primary' : 'default'} variant="outlined" />
                    </TableCell>
                    <TableCell><StatusChip active={u.active} /></TableCell>
                    <TableCell>
                      <Typography variant="caption">{formatDateTime(u.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => { setEditing(u); setModalOpen(true) }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={u.active ? 'Desactivar' : 'Activar'}>
                        <IconButton size="small" color={u.active ? 'error' : 'success'}
                          onClick={() => setToggleId(u.id)}>
                          <PowerSettingsNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={totalElements} page={page}
          onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]} labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>

      <UserFormModal open={modalOpen} user={editing}
        onClose={() => setModalOpen(false)} onSuccess={() => { setModalOpen(false); load() }} />

      <ConfirmDialog open={toggleId !== null} title="Cambiar estado"
        message="¿Confirmas que deseas cambiar el estado de este usuario?"
        onConfirm={handleToggle} onCancel={() => setToggleId(null)} confirmColor="warning" />
    </Box>
  )
}