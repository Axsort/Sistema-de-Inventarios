import { useEffect, useState } from 'react'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Typography
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import StatusChip from '@/shared/components/ui/StatusChip'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog'
import EmptyState from '@/shared/components/ui/EmptyState'
import CategoryFormModal from '../components/CategoryFormModal'
import { categoryService } from '../services/categoryService'
import type { CategoryResponse } from '../types/category.types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryResponse | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    categoryService.findAll()
      .then(setCategories)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await categoryService.delete(deleteId)
      toast.success('Categoría desactivada')
      load()
    } catch {
      toast.error('No se pudo eliminar la categoría')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <Box>
      <PageHeader
        title="Categorías"
        subtitle={`${categories.length} categorías registradas`}
        action={{
          label: 'Nueva Categoría', icon: <Add />,
          onClick: () => { setEditing(null); setModalOpen(true) }
        }}
      />

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>Cargando...</TableCell></TableRow>
              ) : categories.length === 0 ? (
                <TableRow><TableCell colSpan={4}><EmptyState /></TableCell></TableRow>
              ) : (
                categories.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell><Typography variant="body2" fontWeight={600}>{c.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{c.description || '—'}</Typography></TableCell>
                    <TableCell><StatusChip active={c.active} /></TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => { setEditing(c); setModalOpen(true) }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => setDeleteId(c.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CategoryFormModal
        open={modalOpen}
        category={editing}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); load() }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Eliminar categoría"
        message="¿Confirmas que deseas desactivar esta categoría?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}