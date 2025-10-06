"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Calculator, ChefHat } from "lucide-react"
import { mockInsumos, mockCostosHistoricos, mockRecetas, mockProducts } from "@/lib/mock-data"
import type { Insumo, CostoHistorico, Receta, RecetaIngrediente } from "@/lib/types"

export default function RecetasPage() {
  const [insumos, setInsumos] = useState<Insumo[]>(mockInsumos)
  const [costosHistoricos, setCostosHistoricos] = useState<CostoHistorico[]>(mockCostosHistoricos)
  const [recetas, setRecetas] = useState<Receta[]>(mockRecetas)

  // Insumos state
  const [showInsumoDialog, setShowInsumoDialog] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [nuevoInsumo, setNuevoInsumo] = useState({ nombre: "", unidad_base: "" })

  // Costos históricos state
  const [selectedInsumoForCosto, setSelectedInsumoForCosto] = useState<string>("")
  const [showCostoDialog, setShowCostoDialog] = useState(false)
  const [nuevoCosto, setNuevoCosto] = useState({
    vigencia_desde: new Date().toISOString().split("T")[0],
    costo_unitario: "",
    nota: "",
  })

  // Recetas state
  const [selectedPlatoForReceta, setSelectedPlatoForReceta] = useState<string>("")
  const [editingReceta, setEditingReceta] = useState<RecetaIngrediente[]>([])
  const [notaReceta, setNotaReceta] = useState("")

  // Insumos handlers
  const handleSaveInsumo = () => {
    if (!nuevoInsumo.nombre || !nuevoInsumo.unidad_base) {
      alert("Por favor complete todos los campos")
      return
    }

    if (editingInsumo) {
      setInsumos(insumos.map((i) => (i.id === editingInsumo.id ? { ...i, ...nuevoInsumo } : i)))
    } else {
      const newInsumo: Insumo = {
        id: `ins-${Date.now()}`,
        ...nuevoInsumo,
        createdAt: new Date(),
      }
      setInsumos([...insumos, newInsumo])
    }

    setShowInsumoDialog(false)
    setEditingInsumo(null)
    setNuevoInsumo({ nombre: "", unidad_base: "" })
  }

  const handleDeleteInsumo = (id: string) => {
    if (confirm("¿Está seguro de eliminar este insumo?")) {
      setInsumos(insumos.filter((i) => i.id !== id))
    }
  }

  // Costos históricos handlers
  const handleSaveCosto = () => {
    if (!selectedInsumoForCosto || !nuevoCosto.costo_unitario) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    const insumo = insumos.find((i) => i.id === selectedInsumoForCosto)
    if (!insumo) return

    const newCosto: CostoHistorico = {
      id: `cost-${Date.now()}`,
      insumo_id: selectedInsumoForCosto,
      insumo_nombre: insumo.nombre,
      vigencia_desde: new Date(nuevoCosto.vigencia_desde),
      costo_unitario: Number.parseFloat(nuevoCosto.costo_unitario),
      nota: nuevoCosto.nota || undefined,
      createdAt: new Date(),
    }

    setCostosHistoricos([...costosHistoricos, newCosto])
    setShowCostoDialog(false)
    setNuevoCosto({
      vigencia_desde: new Date().toISOString().split("T")[0],
      costo_unitario: "",
      nota: "",
    })
  }

  const getCostosForInsumo = (insumoId: string) => {
    return costosHistoricos
      .filter((c) => c.insumo_id === insumoId)
      .sort((a, b) => b.vigencia_desde.getTime() - a.vigencia_desde.getTime())
  }

  // Recetas handlers
  const handleAddIngredienteToReceta = () => {
    setEditingReceta([
      ...editingReceta,
      {
        insumo_id: "",
        insumo_nombre: "",
        cantidad_base: 0,
        unidad: "",
        merma_porcentaje: 0,
      },
    ])
  }

  const handleUpdateIngrediente = (index: number, field: string, value: any) => {
    const updated = [...editingReceta]
    if (field === "insumo_id") {
      const insumo = insumos.find((i) => i.id === value)
      if (insumo) {
        updated[index] = {
          ...updated[index],
          insumo_id: value,
          insumo_nombre: insumo.nombre,
          unidad: insumo.unidad_base,
        }
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setEditingReceta(updated)
  }

  const handleRemoveIngrediente = (index: number) => {
    setEditingReceta(editingReceta.filter((_, i) => i !== index))
  }

  const calcularCostoTeorico = () => {
    let total = 0
    editingReceta.forEach((ing) => {
      const costos = getCostosForInsumo(ing.insumo_id)
      if (costos.length > 0) {
        const costoActual = costos[0].costo_unitario
        const cantidadConMerma = ing.cantidad_base * (1 + (ing.merma_porcentaje || 0) / 100)
        total += costoActual * cantidadConMerma
      }
    })
    return total
  }

  const handleSaveReceta = () => {
    if (!selectedPlatoForReceta || editingReceta.length === 0) {
      alert("Por favor seleccione un plato y agregue ingredientes")
      return
    }

    const plato = mockProducts.find((p) => p.id === selectedPlatoForReceta)
    if (!plato) return

    const costoTeorico = calcularCostoTeorico()
    const existingReceta = recetas.find((r) => r.plato_id === selectedPlatoForReceta)

    if (existingReceta) {
      setRecetas(
        recetas.map((r) =>
          r.plato_id === selectedPlatoForReceta
            ? {
                ...r,
                ingredientes: editingReceta,
                costo_teorico: costoTeorico,
                nota: notaReceta || undefined,
                updatedAt: new Date(),
              }
            : r,
        ),
      )
    } else {
      const newReceta: Receta = {
        id: `rec-${Date.now()}`,
        plato_id: selectedPlatoForReceta,
        plato_nombre: plato.name,
        ingredientes: editingReceta,
        costo_teorico: costoTeorico,
        nota: notaReceta || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setRecetas([...recetas, newReceta])
    }

    alert("Receta guardada exitosamente")
  }

  const handleLoadReceta = (platoId: string) => {
    const receta = recetas.find((r) => r.plato_id === platoId)
    if (receta) {
      setEditingReceta(receta.ingredientes)
      setNotaReceta(receta.nota || "")
    } else {
      setEditingReceta([])
      setNotaReceta("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Recetas y Costos</h1>
          <p className="text-muted-foreground">Gestión de insumos, costos históricos y recetas por plato</p>
        </div>
        <ChefHat className="h-12 w-12 text-[#870903]" />
      </div>

      <Tabs defaultValue="insumos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insumos">Insumos</TabsTrigger>
          <TabsTrigger value="costos">Costos Históricos</TabsTrigger>
          <TabsTrigger value="recetas">Recetas por Plato</TabsTrigger>
        </TabsList>

        {/* Insumos Tab */}
        <TabsContent value="insumos" className="space-y-4">
          <Card className="border-2 border-[#418B24]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Insumos</CardTitle>
                  <CardDescription>Gestión de insumos base para recetas</CardDescription>
                </div>
                <Dialog open={showInsumoDialog} onOpenChange={setShowInsumoDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#418B24] hover:bg-[#1A4734]"
                      onClick={() => {
                        setEditingInsumo(null)
                        setNuevoInsumo({ nombre: "", unidad_base: "" })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Insumo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingInsumo ? "Editar" : "Nuevo"} Insumo</DialogTitle>
                      <DialogDescription>Complete los datos del insumo</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nombre del Insumo</Label>
                        <Input
                          value={nuevoInsumo.nombre}
                          onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, nombre: e.target.value })}
                          placeholder="Ej: Carne de res"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidad Base</Label>
                        <Select
                          value={nuevoInsumo.unidad_base}
                          onValueChange={(value) => setNuevoInsumo({ ...nuevoInsumo, unidad_base: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                            <SelectItem value="litros">Litros</SelectItem>
                            <SelectItem value="unidades">Unidades</SelectItem>
                            <SelectItem value="gramos">Gramos (g)</SelectItem>
                            <SelectItem value="ml">Mililitros (ml)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInsumoDialog(false)}>
                        Cancelar
                      </Button>
                      <Button className="bg-[#418B24] hover:bg-[#1A4734]" onClick={handleSaveInsumo}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Unidad Base</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insumos.map((insumo) => (
                      <TableRow key={insumo.id}>
                        <TableCell className="font-medium">{insumo.nombre}</TableCell>
                        <TableCell>{insumo.unidad_base}</TableCell>
                        <TableCell>{insumo.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingInsumo(insumo)
                                setNuevoInsumo({ nombre: insumo.nombre, unidad_base: insumo.unidad_base })
                                setShowInsumoDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive bg-transparent"
                              onClick={() => handleDeleteInsumo(insumo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costos Históricos Tab */}
        <TabsContent value="costos" className="space-y-4">
          <Card className="border-2 border-[#FFC700]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Costos Históricos</CardTitle>
                  <CardDescription>Registro de precios de insumos por fecha</CardDescription>
                </div>
                <Dialog open={showCostoDialog} onOpenChange={setShowCostoDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#FFC700] hover:bg-[#FFC700]/80 text-[#1A4734]">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Costo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Nuevo Costo</DialogTitle>
                      <DialogDescription>Ingrese el costo actualizado del insumo</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Insumo</Label>
                        <Select value={selectedInsumoForCosto} onValueChange={setSelectedInsumoForCosto}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione insumo" />
                          </SelectTrigger>
                          <SelectContent>
                            {insumos.map((insumo) => (
                              <SelectItem key={insumo.id} value={insumo.id}>
                                {insumo.nombre} ({insumo.unidad_base})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Vigencia Desde</Label>
                        <Input
                          type="date"
                          value={nuevoCosto.vigencia_desde}
                          onChange={(e) => setNuevoCosto({ ...nuevoCosto, vigencia_desde: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Costo Unitario ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={nuevoCosto.costo_unitario}
                          onChange={(e) => setNuevoCosto({ ...nuevoCosto, costo_unitario: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nota (opcional)</Label>
                        <Input
                          value={nuevoCosto.nota}
                          onChange={(e) => setNuevoCosto({ ...nuevoCosto, nota: e.target.value })}
                          placeholder="Ej: Cambio de proveedor"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCostoDialog(false)}>
                        Cancelar
                      </Button>
                      <Button className="bg-[#FFC700] hover:bg-[#FFC700]/80 text-[#1A4734]" onClick={handleSaveCosto}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Seleccione un insumo para ver su historial de costos</Label>
                  <Select value={selectedInsumoForCosto} onValueChange={setSelectedInsumoForCosto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione insumo" />
                    </SelectTrigger>
                    <SelectContent>
                      {insumos.map((insumo) => (
                        <SelectItem key={insumo.id} value={insumo.id}>
                          {insumo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedInsumoForCosto && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vigencia Desde</TableHead>
                          <TableHead>Costo Unitario</TableHead>
                          <TableHead>Nota</TableHead>
                          <TableHead>Registrado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCostosForInsumo(selectedInsumoForCosto).map((costo) => (
                          <TableRow key={costo.id}>
                            <TableCell className="font-medium">{costo.vigencia_desde.toLocaleDateString()}</TableCell>
                            <TableCell className="text-[#418B24] font-semibold">
                              ${costo.costo_unitario.toFixed(2)}
                            </TableCell>
                            <TableCell>{costo.nota || "-"}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {costo.createdAt.toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recetas por Plato Tab */}
        <TabsContent value="recetas" className="space-y-4">
          <Card className="border-2 border-[#870903]/20">
            <CardHeader>
              <CardTitle>Recetas por Plato</CardTitle>
              <CardDescription>Defina ingredientes y calcule costo teórico de cada plato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Seleccione un Plato</Label>
                <Select
                  value={selectedPlatoForReceta}
                  onValueChange={(value) => {
                    setSelectedPlatoForReceta(value)
                    handleLoadReceta(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione plato" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts
                      .filter((p) => p.category !== "Bebidas")
                      .map((plato) => (
                        <SelectItem key={plato.id} value={plato.id}>
                          {plato.name} - ${plato.price}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlatoForReceta && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Ingredientes de la Receta</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddIngredienteToReceta}
                        className="border-[#418B24] text-[#418B24] bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ingrediente
                      </Button>
                    </div>

                    {editingReceta.length > 0 && (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Insumo</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Merma %</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {editingReceta.map((ing, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Select
                                    value={ing.insumo_id}
                                    onValueChange={(value) => handleUpdateIngrediente(index, "insumo_id", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {insumos.map((insumo) => (
                                        <SelectItem key={insumo.id} value={insumo.id}>
                                          {insumo.nombre} ({insumo.unidad_base})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={ing.cantidad_base}
                                    onChange={(e) =>
                                      handleUpdateIngrediente(index, "cantidad_base", Number.parseFloat(e.target.value))
                                    }
                                    className="w-24"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    step="1"
                                    value={ing.merma_porcentaje || 0}
                                    onChange={(e) =>
                                      handleUpdateIngrediente(
                                        index,
                                        "merma_porcentaje",
                                        Number.parseFloat(e.target.value),
                                      )
                                    }
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive bg-transparent"
                                    onClick={() => handleRemoveIngrediente(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Nota (opcional)</Label>
                    <Input
                      value={notaReceta}
                      onChange={(e) => setNotaReceta(e.target.value)}
                      placeholder="Ej: Receta estándar - 3 tacos por orden"
                    />
                  </div>

                  {editingReceta.length > 0 && (
                    <Card className="bg-[#418B24]/5 border-[#418B24]">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-[#418B24]" />
                          <CardTitle className="text-lg">Cálculo de Costo Teórico</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {editingReceta.map((ing, index) => {
                          const costos = getCostosForInsumo(ing.insumo_id)
                          const costoActual = costos.length > 0 ? costos[0].costo_unitario : 0
                          const cantidadConMerma = ing.cantidad_base * (1 + (ing.merma_porcentaje || 0) / 100)
                          const subtotal = costoActual * cantidadConMerma

                          return (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {ing.insumo_nombre} ({ing.cantidad_base} {ing.unidad}
                                {ing.merma_porcentaje ? ` + ${ing.merma_porcentaje}% merma` : ""})
                              </span>
                              <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                          )
                        })}
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-bold text-lg">Costo Teórico Total:</span>
                          <span className="font-bold text-lg text-[#418B24]">${calcularCostoTeorico().toFixed(2)}</span>
                        </div>
                        {selectedPlatoForReceta && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Precio de Venta:</span>
                            <span className="font-semibold">
                              ${mockProducts.find((p) => p.id === selectedPlatoForReceta)?.price.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedPlatoForReceta && (
                          <div className="flex justify-between">
                            <span className="font-medium">Margen Estimado:</span>
                            <span className="font-bold text-[#418B24]">
                              $
                              {(
                                (mockProducts.find((p) => p.id === selectedPlatoForReceta)?.price || 0) -
                                calcularCostoTeorico()
                              ).toFixed(2)}{" "}
                              (
                              {(
                                (((mockProducts.find((p) => p.id === selectedPlatoForReceta)?.price || 0) -
                                  calcularCostoTeorico()) /
                                  (mockProducts.find((p) => p.id === selectedPlatoForReceta)?.price || 1)) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlatoForReceta("")
                        setEditingReceta([])
                        setNotaReceta("")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button className="bg-[#418B24] hover:bg-[#1A4734]" onClick={handleSaveReceta}>
                      Guardar Receta
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Lista de recetas existentes */}
          {recetas.length > 0 && (
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Recetas Guardadas</CardTitle>
                <CardDescription>Platos con recetas definidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plato</TableHead>
                        <TableHead>Ingredientes</TableHead>
                        <TableHead>Costo Teórico</TableHead>
                        <TableHead>Última Actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recetas.map((receta) => (
                        <TableRow key={receta.id}>
                          <TableCell className="font-medium">{receta.plato_nombre}</TableCell>
                          <TableCell>{receta.ingredientes.length} ingredientes</TableCell>
                          <TableCell className="text-[#418B24] font-semibold">
                            ${receta.costo_teorico.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {receta.updatedAt.toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
