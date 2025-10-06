"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { Plus, Search, Pencil, Trash2, Package, DollarSign, ShoppingBag, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "PLATO" as "PLATO" | "BEBIDA",
    precio: "",
    img_url: "",
    activo: 1,
  })

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "all" || product.tipo === tipoFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.activo === 1) ||
      (statusFilter === "inactive" && product.activo === 0)
    return matchesSearch && matchesTipo && matchesStatus
  })

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.activo === 1).length
  const averagePrice = products.reduce((sum, p) => sum + Number.parseFloat(p.precio), 0) / products.length || 0

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        nombre: product.nombre,
        tipo: product.tipo,
        precio: product.precio,
        img_url: product.img_url || "",
        activo: product.activo,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        nombre: "",
        tipo: "PLATO",
        precio: "",
        img_url: "",
        activo: 1,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setFormData({
      nombre: "",
      tipo: "PLATO",
      precio: "",
      img_url: "",
      activo: 1,
    })
  }

  const handleSaveProduct = () => {
    if (!formData.nombre || !formData.precio) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const price = Number.parseFloat(formData.precio)
    if (isNaN(price) || price <= 0) {
      alert("El precio debe ser un número válido mayor a 0")
      return
    }

    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id_producto === editingProduct.id_producto
            ? {
                ...p,
                nombre: formData.nombre,
                tipo: formData.tipo,
                precio: price.toFixed(2),
                img_url: formData.img_url || null,
                activo: formData.activo,
              }
            : p,
        ),
      )
    } else {
      // Create new product
      const newProduct: Product = {
        id_producto: Math.max(...products.map((p) => p.id_producto)) + 1,
        nombre: formData.nombre,
        tipo: formData.tipo,
        precio: price.toFixed(2),
        img_url: formData.img_url || null,
        activo: formData.activo,
        created_at: new Date(),
      }
      setProducts([...products, newProduct])
    }

    handleCloseDialog()
  }

  const handleDeleteProduct = (productId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProducts(products.filter((p) => p.id_producto !== productId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#870903]">Gestión de Productos</h1>
          <p className="text-[#1A4734] mt-1">Administra el menú del restaurante</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#870903] hover:bg-[#6a0702] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-[#870903] to-[#6a0702] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Productos</p>
              <p className="text-3xl font-bold mt-1">{totalProducts}</p>
            </div>
            <Package className="h-12 w-12 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#418B24] to-[#1A4734] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Productos Activos</p>
              <p className="text-3xl font-bold mt-1">{activeProducts}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-white/30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FFC700] to-[#e6b300] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Precio Promedio</p>
              <p className="text-3xl font-bold mt-1">${averagePrice.toFixed(2)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-white/30" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="PLATO">Platos</SelectItem>
              <SelectItem value="BEBIDA">Bebidas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FEFBE8] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#870903]">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#870903]">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#870903]">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#870903]">Estado</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-[#870903]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id_producto} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.img_url ? (
                        <img
                          src={product.img_url || "/placeholder.svg"}
                          alt={product.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#FEFBE8] flex items-center justify-center">
                          <Package className="h-6 w-6 text-[#870903]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#1A4734]">{product.nombre}</p>
                        <p className="text-sm text-gray-500">ID: {product.id_producto}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        product.tipo === "PLATO" ? "border-[#870903] text-[#870903]" : "border-[#418B24] text-[#418B24]"
                      }
                    >
                      {product.tipo}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#870903]">${product.precio}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        product.activo === 1 ? "bg-[#418B24] hover:bg-[#1A4734]" : "bg-gray-400 hover:bg-gray-500"
                      }
                    >
                      {product.activo === 1 ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {product.tipo === "PLATO" && (
                        <Link href={`/dashboard/recetas?plato=${product.id_producto}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#FFC700] hover:text-[#e6b300] hover:bg-[#FEFBE8]"
                            title="Ver receta"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(product)}
                        className="text-[#418B24] hover:text-[#1A4734] hover:bg-[#FEFBE8]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id_producto)}
                        className="text-[#870903] hover:text-[#6a0702] hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#870903]">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Modifica la información del producto" : "Completa los datos del nuevo producto"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Tacos al Pastor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: "PLATO" | "BEBIDA") => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLATO">Plato</SelectItem>
                    <SelectItem value="BEBIDA">Bebida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="img_url">URL de Imagen (opcional)</Label>
              <Input
                id="img_url"
                value={formData.img_url}
                onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo === 1}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? 1 : 0 })}
                className="h-4 w-4 rounded border-gray-300 text-[#418B24] focus:ring-[#418B24]"
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Producto activo
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} className="bg-[#870903] hover:bg-[#6a0702] text-white">
              {editingProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
