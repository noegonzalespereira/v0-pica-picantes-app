import type { Product, Order, Caja, Gasto, Insumo, CostoHistorico, Receta, User } from "./types"

// Mock product data - replace with API calls to NestJS backend
export const mockProducts: Product[] = [
  {
    id_producto: 1,
    nombre: "Tacos al Pastor",
    tipo: "PLATO",
    precio: "12.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 2,
    nombre: "Tacos de Asada",
    tipo: "PLATO",
    precio: "13.00",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 3,
    nombre: "Burrito Picante",
    tipo: "PLATO",
    precio: "15.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 4,
    nombre: "Quesadilla Tradicional",
    tipo: "PLATO",
    precio: "9.00",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 5,
    nombre: "Enchiladas Verdes",
    tipo: "PLATO",
    precio: "13.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 6,
    nombre: "Agua de Horchata",
    tipo: "BEBIDA",
    precio: "3.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 7,
    nombre: "Agua de Jamaica",
    tipo: "BEBIDA",
    precio: "3.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 8,
    nombre: "Refresco",
    tipo: "BEBIDA",
    precio: "2.50",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 9,
    nombre: "Cerveza",
    tipo: "BEBIDA",
    precio: "4.00",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
  {
    id_producto: 10,
    nombre: "Nachos Supreme",
    tipo: "PLATO",
    precio: "14.00",
    img_url: null,
    activo: 1,
    created_at: new Date(),
  },
]

// Mock cajas array for gastos module
export const mockCajas: Caja[] = [
  {
    id: "caja-1",
    estado: "ABIERTA",
    monto_apertura: 500.0,
    fecha_apertura: new Date(),
    id_usuario: "user-1",
  },
  {
    id: "caja-2",
    estado: "CERRADA",
    monto_apertura: 450.0,
    monto_cierre: 1250.0,
    fecha_apertura: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    fecha_cierre: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    id_usuario: "user-2",
  },
]

export const mockCaja: Caja = {
  id: "caja-1",
  estado: "ABIERTA",
  monto_apertura: 500.0,
  fecha_apertura: new Date(),
  id_usuario: "user-1",
}

export const mockOrders: Order[] = [
  {
    id: "order-1",
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        notes: "Sin cebolla",
        subtotal: 25.0,
      },
      {
        product: mockProducts[5],
        quantity: 1,
        subtotal: 3.5,
      },
    ],
    subtotal: 28.5,
    tax: 4.56,
    total: 33.06,
    tipo: "MESA",
    num_mesa: "5",
    estado_pedido: "PENDIENTE",
    estado_pago: "SIN_PAGAR",
    id_caja: "caja-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "order-2",
    items: [
      {
        product: mockProducts[2],
        quantity: 1,
        subtotal: 15.5,
      },
    ],
    subtotal: 15.5,
    tax: 2.48,
    total: 17.98,
    tipo: "LLEVAR",
    estado_pedido: "LISTO",
    estado_pago: "PAGADO",
    metodo_pago: "EFECTIVO",
    id_caja: "caja-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "order-3",
    items: [
      {
        product: mockProducts[6],
        quantity: 1,
        subtotal: 14.0,
      },
      {
        product: mockProducts[8],
        quantity: 2,
        subtotal: 5.0,
      },
    ],
    subtotal: 19.0,
    tax: 3.04,
    total: 22.04,
    tipo: "MESA",
    num_mesa: "3",
    estado_pedido: "LISTO",
    estado_pago: "PAGADO",
    metodo_pago: "QR",
    id_caja: "caja-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
  },
]

// Mock gastos array for gastos module
export const mockGastos: Gasto[] = [
  {
    id: "gasto-1",
    nombre: "Verduras frescas",
    descripcion: "Compra de verduras para la semana",
    cantidad: 5,
    precio_unitario: 12.5,
    total: 62.5,
    fecha: new Date(),
    id_caja: "caja-1",
    id_usuario: "user-1",
    createdAt: new Date(),
  },
  {
    id: "gasto-2",
    nombre: "Gas para cocina",
    descripcion: "Recarga de tanque de gas",
    cantidad: 1,
    precio_unitario: 85.0,
    total: 85.0,
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    id_caja: "caja-2",
    id_usuario: "user-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "gasto-3",
    nombre: "Servilletas y vasos",
    descripcion: "Material desechable para el restaurante",
    cantidad: 10,
    precio_unitario: 8.5,
    total: 85.0,
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    id_usuario: "user-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]

// Mock data for Recetas module
export const mockInsumos: Insumo[] = [
  { id: "ins-1", nombre: "Carne de cerdo", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-2", nombre: "Tortillas de maíz", unidad_base: "unidades", createdAt: new Date() },
  { id: "ins-3", nombre: "Cilantro", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-4", nombre: "Cebolla", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-5", nombre: "Piña", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-6", nombre: "Queso", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-7", nombre: "Frijoles", unidad_base: "kg", createdAt: new Date() },
  { id: "ins-8", nombre: "Arroz", unidad_base: "kg", createdAt: new Date() },
]

export const mockCostosHistoricos: CostoHistorico[] = [
  {
    id: "cost-1",
    insumo_id: "ins-1",
    insumo_nombre: "Carne de cerdo",
    vigencia_desde: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    costo_unitario: 85.0,
    nota: "Precio proveedor anterior",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "cost-2",
    insumo_id: "ins-1",
    insumo_nombre: "Carne de cerdo",
    vigencia_desde: new Date(),
    costo_unitario: 92.0,
    nota: "Nuevo proveedor - mejor calidad",
    createdAt: new Date(),
  },
  {
    id: "cost-3",
    insumo_id: "ins-2",
    insumo_nombre: "Tortillas de maíz",
    vigencia_desde: new Date(),
    costo_unitario: 0.5,
    createdAt: new Date(),
  },
]

export const mockRecetas: Receta[] = [
  {
    id: "rec-1",
    plato_id: "1",
    plato_nombre: "Tacos al Pastor",
    ingredientes: [
      { insumo_id: "ins-1", insumo_nombre: "Carne de cerdo", cantidad_base: 0.15, unidad: "kg", merma_porcentaje: 10 },
      { insumo_id: "ins-2", insumo_nombre: "Tortillas de maíz", cantidad_base: 3, unidad: "unidades" },
      { insumo_id: "ins-3", insumo_nombre: "Cilantro", cantidad_base: 0.01, unidad: "kg" },
      { insumo_id: "ins-4", insumo_nombre: "Cebolla", cantidad_base: 0.02, unidad: "kg" },
      { insumo_id: "ins-5", insumo_nombre: "Piña", cantidad_base: 0.03, unidad: "kg" },
    ],
    costo_teorico: 4.85,
    nota: "Receta estándar - 3 tacos por orden",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock users for user management module
export const mockUsers: User[] = [
  {
    id: "user-1",
    nombre: "Juan Pérez",
    email: "juan@elpuntopicante.com",
    rol: "gerente",
    estado: "ACTIVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
  },
  {
    id: "user-2",
    nombre: "María González",
    email: "maria@elpuntopicante.com",
    rol: "cajero",
    estado: "ACTIVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: "user-3",
    nombre: "Carlos Ramírez",
    email: "carlos@elpuntopicante.com",
    rol: "cocina",
    estado: "ACTIVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
  },
  {
    id: "user-4",
    nombre: "Ana López",
    email: "ana@elpuntopicante.com",
    rol: "cajero",
    estado: "INACTIVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: "user-5",
    nombre: "Pedro Martínez",
    email: "pedro@elpuntopicante.com",
    rol: "cocina",
    estado: "ACTIVO",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
]
