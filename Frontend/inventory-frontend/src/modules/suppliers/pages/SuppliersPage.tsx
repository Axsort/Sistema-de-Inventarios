import { useEffect, useState } from 'react'
import { Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Tooltip, Typography } from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import toast from 'react-hot-toast'
import PageHeader from '@/shared/components/ui/PageHeader'
import EmptyState from '@/shared/components/ui/EmptyState'
import { supplierService } from '../services/supplierService'
import type { SupplierResponse } from '../types/supplier.types'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await supplierService.findAll()
      setSuppliers(data.content)
    } catch { toast.error('Error al cargar proveedores') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <Box>
      <PageHeader title="Proveedores" onAdd={() => {}} />
      {suppliers.length === 0 && !loading
        ? <EmptyState message="Sin proveedores registrados" />
        : (
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton size="small"><Edit fontSize="small" /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
    </Box>
  )
}