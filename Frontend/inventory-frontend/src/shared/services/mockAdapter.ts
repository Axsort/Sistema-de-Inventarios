import type { AxiosInstance } from 'axios'

const mockCategory = { id: 1, name: 'Electrónicos', description: '', active: true, createdAt: '2024-01-01T00:00:00' }
const mockSupplier = { id: 1, name: 'Proveedor Demo', email: 'proveedor@demo.com', phone: '555-1234', active: true, createdAt: '2024-01-01T00:00:00' }

const mockProducts = [
  { id: 1, name: 'Laptop HP', sku: 'LAP-001', purchasePrice: 8000, salePrice: 12000, stock: 15, minStock: 5, lowStock: false, category: mockCategory, supplier: mockSupplier, active: true, createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00' },
  { id: 2, name: 'Mouse Logitech', sku: 'MOU-001', purchasePrice: 200, salePrice: 350, stock: 3, minStock: 10, lowStock: true, category: mockCategory, supplier: mockSupplier, active: true, createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00' },
  { id: 3, name: 'Teclado Mecánico', sku: 'TEC-001', purchasePrice: 500, salePrice: 850, stock: 8, minStock: 5, lowStock: false, category: mockCategory, supplier: mockSupplier, active: false, createdAt: '2024-01-01T00:00:00', updatedAt: '2024-01-01T00:00:00' },
]

const mockUsers = [
  { id: 1, name: 'Admin Local', email: 'admin@test.com', role: 'ADMIN', active: true, createdAt: '2024-01-01T00:00:00' },
  { id: 2, name: 'Empleado Demo', email: 'empleado@test.com', role: 'EMPLOYEE', active: true, createdAt: '2024-01-01T00:00:00' },
]

const mockMovements = [
  { id: 1, productName: 'Laptop HP', productSku: 'LAP-001', type: 'ENTRY', quantity: 10, reason: 'Compra inicial', userName: 'Admin Local', createdAt: '2024-01-15T10:00:00' },
  { id: 2, productName: 'Mouse Logitech', productSku: 'MOU-001', type: 'EXIT', quantity: 2, reason: 'Venta', userName: 'Admin Local', createdAt: '2024-01-16T11:00:00' },
]

const page = (content: any[]) => ({
  content, totalElements: content.length, totalPages: 1, number: 0, size: 10, first: true, last: true,
})

const ok = (data: any) => ({ data: { success: true, data, timestamp: new Date().toISOString() } })

export function applyMocks(api: AxiosInstance) {
  api.interceptors.request.use(async (config) => {
    const url = config.url ?? ''

    let data: any = undefined
    let unauthorized = false

    if (url.includes('/auth/login')) {
        console.log('LOGIN DATA:', config.data, typeof config.data)
      const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
      if (body.email === 'admin@inventory.com' && body.password === 'admin123') {
        data = { token: 'mock-token', id: 1, name: 'Admin Local', email: body.email, role: 'ADMIN' }
      } else {
        unauthorized = true
      }
    } else if (url.includes('/products/low-stock')) {
  data = mockProducts.filter(p => p.lowStock)
} else if (url.match(/\/products\/\d+/)) {
  data = mockProducts[0]
} else if (url.includes('/products')) {
  data = page(mockProducts)                        // ← products SÍ usa PageResponse
} else if (url.match(/\/categories\/\d+/)) {
  data = mockCategory
} else if (url.includes('/categories/active')) {
  data = [mockCategory]                            // ← array directo
} else if (url.includes('/categories')) {
  data = [mockCategory]                            // ← array directo
} else if (url.match(/\/suppliers\/\d+/)) {
  data = mockSupplier
} else if (url.includes('/suppliers')) {
  data = page([mockSupplier])                      // ← revisar supplierService
} else if (url.includes('/movements')) {
  data = page(mockMovements)                       // ← revisar movementService
} else if (url.includes('/users')) {
  data = page(mockUsers)                           // ← revisar userService
} else if (url.includes('/dashboard')) {
  data = { totalProducts: 3, totalCategories: 1, totalSuppliers: 1, lowStockCount: 1, recentMovements: mockMovements }
}

    if (unauthorized) {
      config.adapter = async () => Promise.reject({ response: { status: 401, data: { message: 'Credenciales incorrectas' } } })
    } else if (data !== undefined) {
      config.adapter = async () => ({ data: ok(data).data, status: 200, statusText: 'OK', headers: {}, config })
    }

    return config
  })
}