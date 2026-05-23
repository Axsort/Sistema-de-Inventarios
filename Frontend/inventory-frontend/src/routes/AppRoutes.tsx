import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/shared/components/guards/ProtectedRoute'
import RoleGuard from '@/shared/components/guards/RoleGuard'
import AppLayout from '@/shared/components/layout/AppLayout'

import LoginPage from '@/modules/auth/pages/LoginPage'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import ProductsPage from '@/modules/products/pages/ProductsPage'
import ProductFormPage from '@/modules/products/pages/ProductFormPage'
import CategoriesPage from '@/modules/categories/pages/CategoriesPage'
import SuppliersPage from '@/modules/suppliers/pages/SuppliersPage'
import MovementsPage from '@/modules/movements/pages/MovementsPage'
import MovementFormPage from '@/modules/movements/pages/MovementFormPage'
import LowStockPage from '@/modules/products/pages/LowStockPage'
import UsersPage from '@/modules/users/pages/UsersPage'
import NotFoundPage from '@/shared/components/ui/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/movements" element={<MovementsPage />} />
          <Route path="/movements/new" element={<MovementFormPage />} />
          <Route path="/low-stock" element={<LowStockPage />} />

          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}