// Type definitions for the POS system

export interface Product {
  id_producto: number
  nombre: string
  tipo: "PLATO" | "BEBIDA"
  precio: string // decimal stored as string
  img_url: string | null
  activo: number // 1 = active, 0 = inactive
  created_at: Date
}

export interface OrderItem {
  product: Product
  quantity: number
  notes?: string
  subtotal: number
  destino?: "MESA" | "LLEVAR" // Destination for mixed orders
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  tax: number
  subtotal: number
  tipo: "MESA" | "LLEVAR" | "MIXTO" // Order type: Table, Takeout, or Mixed
  num_mesa?: string // Table number if tipo is MESA
  estado_pedido: "PENDIENTE" | "LISTO" // Order status: Pending or Ready
  estado_pago: "PAGADO" | "SIN_PAGAR" // Payment status: Paid or Unpaid
  metodo_pago?: "EFECTIVO" | "QR" // Payment method
  id_caja?: string // Cash register ID
  createdAt: Date
  updatedAt: Date
}

export const PRODUCT_CATEGORIES = [
  "Tacos",
  "Burritos",
  "Quesadillas",
  "Nachos",
  "Enchiladas",
  "Bebidas",
  "Postres",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitCost: number
  supplier?: string
  lastRestocked?: Date
}

export interface InventoryPlato {
  id: string
  producto_id: string
  producto_nombre: string
  fecha: Date
  cantidad_inicial: number
  vendido: number
  disponible: number
}

export interface InventoryBebida {
  id: string
  producto_id: string
  producto_nombre: string
  stock_global: number
  disponible: number
}

export interface AperturaPlato {
  id: string
  fecha: Date
  plato_id: string
  plato_nombre: string
  cantidad_inicial: number
  createdAt: Date
}

export interface IngresoMovimiento {
  id: string
  tipo: "PLATO" | "BEBIDA"
  producto_id: string
  producto_nombre: string
  cantidad: number
  motivo?: string
  fecha: Date
  createdAt: Date
}

export interface MermaMovimiento {
  id: string
  tipo: "PLATO" | "BEBIDA"
  producto_id: string
  producto_nombre: string
  cantidad: number
  motivo: string
  fecha: Date
  createdAt: Date
}

export interface Recipe {
  id: string
  productId: string
  productName: string
  ingredients: RecipeIngredient[]
  preparationTime: number // in minutes
  cost: number
  margin: number
}

export interface RecipeIngredient {
  inventoryItemId: string
  inventoryItemName: string
  quantity: number
  unit: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
  paymentMethod: "cash" | "card" | "transfer"
  notes?: string
}

export interface Gasto {
  id: string
  nombre: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
  fecha: Date
  id_caja?: string
  id_usuario: string
  createdAt: Date
}

export interface Caja {
  id: string
  estado: "ABIERTA" | "CERRADA" // Open or Closed
  monto_apertura: number
  monto_cierre?: number
  fecha_apertura: Date
  fecha_cierre?: Date
  id_usuario: string
}

export interface Insumo {
  id: string
  nombre: string
  unidad_base: string // kg, litros, unidades, etc.
  createdAt: Date
}

export interface CostoHistorico {
  id: string
  insumo_id: string
  insumo_nombre: string
  vigencia_desde: Date
  costo_unitario: number
  nota?: string
  createdAt: Date
}

export interface RecetaIngrediente {
  insumo_id: string
  insumo_nombre: string
  cantidad_base: number
  unidad: string
  merma_porcentaje?: number
}

export interface Receta {
  id: string
  plato_id: string
  plato_nombre: string
  ingredientes: RecetaIngrediente[]
  costo_teorico: number
  nota?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  nombre: string
  email: string
  password?: string // Optional for display, required for creation
  rol: "gerente" | "cajero" | "cocina"
  estado: "ACTIVO" | "INACTIVO"
  createdAt: Date
  updatedAt: Date
}
