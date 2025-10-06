"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, DollarSign, Calendar, Filter } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { mockCajas, mockGastos } from "@/lib/mock-data"
import type { Gasto, Caja } from "@/lib/types"

export default function GastosPage() {
  const currentUser = getCurrentUser()
  const [gastos, setGastos] = useState<Gasto[]>(mockGastos)
  const [cajas] = useState<Caja[]>(mockCajas)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFecha, setFilterFecha] = useState("")
  const [filterCaja, setFilterCaja] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 1,
    precio_unitario: 0,
    fecha: new Date().toISOString().split("T")[0],
  })

  // Get open caja for current user (if cajero)
  const cajaAbierta = cajas.find((c) => c.estado === "ABIERTA" && c.id_usuario === currentUser?.id)

  // Check if user can register expenses
  const canRegisterExpense = () => {
    if (currentUser?.role === "gerente") return true
    if (currentUser?.role === "cajero" && cajaAbierta) return true
    return false
  }

  // Filter gastos
  const filteredGastos = gastos.filter((gasto) => {
    const matchesSearch =
      gasto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gasto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFecha = filterFecha ? gasto.fecha.toISOString().split("T")[0] === filterFecha : true
    const matchesCaja = filterCaja ? gasto.id_caja === filterCaja : true
    return matchesSearch && matchesFecha && matchesCaja
  })

  // Calculate summary
  const totalGastos = filteredGastos.reduce((sum, g) => sum + g.total, 0)
  const countGastos = filteredGastos.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!canRegisterExpense()) {
      alert("No puedes registrar gastos sin una caja abierta")
      return
    }

    const newGasto: Gasto = {
      id: `gasto-${Date.now()}`,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      cantidad: formData.cantidad,
      precio_unitario: formData.precio_unitario,
      total: formData.cantidad * formData.precio_unitario,
      fecha: new Date(formData.fecha),
      id_caja: currentUser?.role === "cajero" ? cajaAbierta?.id : undefined,
      id_usuario: currentUser?.id || "",
      createdAt: new Date(),
    }

    setGastos([newGasto, ...gastos])
    setIsDialogOpen(false)
    setFormData({
      nombre: "",
      descripcion: "",
      cantidad: 1,
      precio_unitario: 0,
      fecha: new Date().toISOString().split("T")[0],
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterFecha("")
    setFilterCaja("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#870903]">Gastos</h1>
          <p className="text-[#1A4734]/70">Registro y consulta de gastos del negocio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#870903] hover:bg-[#870903]/90 text-white" disabled={!canRegisterExpense()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#870903]">Registrar Nuevo Gasto</DialogTitle>
              <DialogDescription>
                {currentUser?.role === "cajero" && cajaAbierta
                  ? `Registrando en caja: ${cajaAbierta.id}`
                  : "Registrando gasto fuera de turno"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Gasto</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Verduras frescas"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Detalles del gasto..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: Number.parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="precio_unitario">Precio Unitario</Label>
                  <Input
                    id="precio_unitario"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio_unitario}
                    onChange={(e) =>
                      setFormData({ ...formData, precio_unitario: Number.parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="bg-[#FEFBE8] p-3 rounded-lg border border-[#FFC700]/30">
                <p className="text-sm text-[#1A4734]">
                  <span className="font-semibold">Total:</span> $
                  {(formData.cantidad * formData.precio_unitario).toFixed(2)}
                </p>
              </div>
              <Button type="submit" className="w-full bg-[#418B24] hover:bg-[#418B24]/90">
                Registrar Gasto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Warning for cajero without open caja */}
      {currentUser?.role === "cajero" && !cajaAbierta && (
        <Card className="border-[#FFC700] bg-[#FFC700]/10">
          <CardContent className="pt-6">
            <p className="text-[#870903] font-medium">
              ⚠️ No tienes una caja abierta. No puedes registrar gastos hasta abrir una caja.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#418B24]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#1A4734]">Total Gastos</CardTitle>
            <DollarSign className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#418B24]">${totalGastos.toFixed(2)}</div>
            <p className="text-xs text-[#1A4734]/70">Período filtrado</p>
          </CardContent>
        </Card>
        <Card className="border-[#FFC700]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#1A4734]">Cantidad</CardTitle>
            <Calendar className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFC700]">{countGastos}</div>
            <p className="text-xs text-[#1A4734]/70">Gastos registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#870903] flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#1A4734]/50" />
                <Input
                  id="search"
                  placeholder="Nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filterFecha">Fecha</Label>
              <Input
                id="filterFecha"
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filterCaja">Caja</Label>
              <select
                id="filterCaja"
                value={filterCaja}
                onChange={(e) => setFilterCaja(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todas las cajas</option>
                {cajas.map((caja) => (
                  <option key={caja.id} value={caja.id}>
                    {caja.id} - {caja.estado}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full border-[#870903] text-[#870903] hover:bg-[#870903]/10 bg-transparent"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gastos List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#870903]">Listado de Gastos</CardTitle>
          <CardDescription>Historial completo de gastos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">P. Unitario</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Caja</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGastos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-[#1A4734]/50">
                    No hay gastos registrados
                  </TableCell>
                </TableRow>
              ) : (
                filteredGastos.map((gasto) => (
                  <TableRow key={gasto.id}>
                    <TableCell>{gasto.fecha.toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium text-[#870903]">{gasto.nombre}</TableCell>
                    <TableCell className="text-[#1A4734]/70">{gasto.descripcion}</TableCell>
                    <TableCell className="text-right">{gasto.cantidad}</TableCell>
                    <TableCell className="text-right">${gasto.precio_unitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-[#418B24]">${gasto.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {gasto.id_caja ? (
                        <Badge variant="outline" className="border-[#FFC700] text-[#FFC700]">
                          {gasto.id_caja}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#1A4734]/30 text-[#1A4734]/50">
                          Sin caja
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
