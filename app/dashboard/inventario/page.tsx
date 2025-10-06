"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, AlertTriangle, TrendingUp, Calendar, Plus } from "lucide-react"
import type { InventoryPlato, InventoryBebida } from "@/lib/types"

// Mock data for platos (dishes)
const mockPlatos: InventoryPlato[] = [
  {
    id: "1",
    producto_id: "p1",
    producto_nombre: "Tacos al Pastor",
    fecha: new Date(),
    cantidad_inicial: 50,
    vendido: 23,
    disponible: 27,
  },
  {
    id: "2",
    producto_id: "p2",
    producto_nombre: "Enchiladas Verdes",
    fecha: new Date(),
    cantidad_inicial: 30,
    vendido: 15,
    disponible: 15,
  },
  {
    id: "3",
    producto_id: "p3",
    producto_nombre: "Quesadillas",
    fecha: new Date(),
    cantidad_inicial: 40,
    vendido: 28,
    disponible: 12,
  },
]

// Mock data for bebidas (drinks)
const mockBebidas: InventoryBebida[] = [
  {
    id: "1",
    producto_id: "b1",
    producto_nombre: "Coca Cola",
    stock_global: 120,
    disponible: 95,
  },
  {
    id: "2",
    producto_id: "b2",
    producto_nombre: "Agua Mineral",
    stock_global: 80,
    disponible: 62,
  },
  {
    id: "3",
    producto_id: "b3",
    producto_nombre: "Jugo de Naranja",
    stock_global: 45,
    disponible: 30,
  },
]

// Mock available products
const availablePlatos = [
  { id: "p1", nombre: "Tacos al Pastor" },
  { id: "p2", nombre: "Enchiladas Verdes" },
  { id: "p3", nombre: "Quesadillas" },
  { id: "p4", nombre: "Burritos" },
  { id: "p5", nombre: "Nachos" },
]

const availableBebidas = [
  { id: "b1", nombre: "Coca Cola" },
  { id: "b2", nombre: "Agua Mineral" },
  { id: "b3", nombre: "Jugo de Naranja" },
  { id: "b4", nombre: "Horchata" },
]

export default function InventarioPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [platos, setPlatos] = useState<InventoryPlato[]>(mockPlatos)
  const [bebidas, setBebidas] = useState<InventoryBebida[]>(mockBebidas)

  // Apertura de Platos state
  const [aperturaPlatos, setAperturaPlatos] = useState<{ [key: string]: number }>({})

  // Ingreso de Bebidas state
  const [showIngresoBebidaDialog, setShowIngresoBebidaDialog] = useState(false)
  const [ingresoBebida, setIngresoBebida] = useState({
    bebida_id: "",
    cantidad: "",
    motivo: "",
  })

  // Mermas state
  const [showMermaDialog, setShowMermaDialog] = useState(false)
  const [mermaData, setMermaData] = useState({
    tipo: "PLATO" as "PLATO" | "BEBIDA",
    producto_id: "",
    cantidad: "",
    motivo: "",
    fecha: new Date().toISOString().split("T")[0],
  })

  const handleGuardarApertura = () => {
    // TODO: Save apertura via API
    console.log("[v0] Guardando apertura de platos:", aperturaPlatos)

    // Update platos with new cantidad_inicial
    const updatedPlatos = availablePlatos
      .map((plato) => {
        const cantidad = aperturaPlatos[plato.id] || 0
        const existing = platos.find(
          (p) => p.producto_id === plato.id && new Date(p.fecha).toISOString().split("T")[0] === selectedDate,
        )

        if (existing) {
          return {
            ...existing,
            cantidad_inicial: cantidad,
            disponible: cantidad - existing.vendido,
          }
        }

        return {
          id: Date.now().toString() + plato.id,
          producto_id: plato.id,
          producto_nombre: plato.nombre,
          fecha: new Date(selectedDate),
          cantidad_inicial: cantidad,
          vendido: 0,
          disponible: cantidad,
        }
      })
      .filter((p) => p.cantidad_inicial > 0)

    setPlatos(updatedPlatos)
    alert("Apertura de platos guardada exitosamente")
  }

  const handleRegistrarIngreso = () => {
    if (!ingresoBebida.bebida_id || !ingresoBebida.cantidad) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    // TODO: Register ingreso via API
    console.log("[v0] Registrando ingreso de bebida:", ingresoBebida)

    // Update bebida stock
    setBebidas(
      bebidas.map((b) => {
        if (b.producto_id === ingresoBebida.bebida_id) {
          const cantidad = Number.parseFloat(ingresoBebida.cantidad)
          return {
            ...b,
            stock_global: b.stock_global + cantidad,
            disponible: b.disponible + cantidad,
          }
        }
        return b
      }),
    )

    setShowIngresoBebidaDialog(false)
    setIngresoBebida({ bebida_id: "", cantidad: "", motivo: "" })
    alert("Ingreso de bebida registrado exitosamente")
  }

  const handleRegistrarMerma = () => {
    if (!mermaData.producto_id || !mermaData.cantidad || !mermaData.motivo) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    // TODO: Register merma via API
    console.log("[v0] Registrando merma:", mermaData)

    const cantidad = Number.parseFloat(mermaData.cantidad)

    if (mermaData.tipo === "PLATO") {
      setPlatos(
        platos.map((p) => {
          if (
            p.producto_id === mermaData.producto_id &&
            new Date(p.fecha).toISOString().split("T")[0] === mermaData.fecha
          ) {
            return {
              ...p,
              disponible: Math.max(0, p.disponible - cantidad),
            }
          }
          return p
        }),
      )
    } else {
      setBebidas(
        bebidas.map((b) => {
          if (b.producto_id === mermaData.producto_id) {
            return {
              ...b,
              disponible: Math.max(0, b.disponible - cantidad),
            }
          }
          return b
        }),
      )
    }

    setShowMermaDialog(false)
    setMermaData({
      tipo: "PLATO",
      producto_id: "",
      cantidad: "",
      motivo: "",
      fecha: new Date().toISOString().split("T")[0],
    })
    alert("Merma registrada exitosamente")
  }

  const totalPlatos = platos.reduce((sum, p) => sum + p.disponible, 0)
  const totalBebidas = bebidas.reduce((sum, b) => sum + b.disponible, 0)
  const platosVendidos = platos.reduce((sum, p) => sum + p.vendido, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#870903]">Inventario Operativo</h1>
          <p className="text-muted-foreground">Gestión de disponibilidad diaria y stock</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-[#418B24]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platos Disponibles</CardTitle>
            <Package className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPlatos}</div>
            <p className="text-xs text-muted-foreground mt-1">Porciones disponibles hoy</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#FFC700]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bebidas Disponibles</CardTitle>
            <Package className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalBebidas}</div>
            <p className="text-xs text-muted-foreground mt-1">Unidades en stock global</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#870903]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendido Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#870903]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{platosVendidos}</div>
            <p className="text-xs text-muted-foreground mt-1">Platos vendidos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="disponibilidad" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
          <TabsTrigger value="apertura">Apertura de Platos</TabsTrigger>
          <TabsTrigger value="ingreso">Ingreso de Bebidas</TabsTrigger>
          <TabsTrigger value="mermas">Mermas</TabsTrigger>
        </TabsList>

        {/* Tab 1: Disponibilidad */}
        <TabsContent value="disponibilidad" className="space-y-4">
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Disponibilidad de Inventario</CardTitle>
                  <CardDescription>Consulta de stock disponible</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platos Table */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#870903]">Platos (Fecha: {selectedDate})</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Stock Día</TableHead>
                        <TableHead className="text-right">Vendido</TableHead>
                        <TableHead className="text-right">Disponible</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {platos
                        .filter((p) => new Date(p.fecha).toISOString().split("T")[0] === selectedDate)
                        .map((plato) => (
                          <TableRow key={plato.id}>
                            <TableCell className="font-medium">{plato.producto_nombre}</TableCell>
                            <TableCell className="text-right">{plato.cantidad_inicial}</TableCell>
                            <TableCell className="text-right">{plato.vendido}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={plato.disponible > 10 ? "secondary" : "destructive"}
                                className={plato.disponible > 10 ? "bg-[#418B24] text-white" : "bg-[#870903]"}
                              >
                                {plato.disponible}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      {platos.filter((p) => new Date(p.fecha).toISOString().split("T")[0] === selectedDate).length ===
                        0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No hay platos registrados para esta fecha
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Bebidas Table */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#FFC700]">Bebidas (Stock Global)</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Stock Global</TableHead>
                        <TableHead className="text-right">Disponible</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bebidas.map((bebida) => (
                        <TableRow key={bebida.id}>
                          <TableCell className="font-medium">{bebida.producto_nombre}</TableCell>
                          <TableCell className="text-right">{bebida.stock_global}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={bebida.disponible > 20 ? "secondary" : "destructive"}
                              className={bebida.disponible > 20 ? "bg-[#418B24] text-white" : "bg-[#870903]"}
                            >
                              {bebida.disponible}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Apertura de Platos */}
        <TabsContent value="apertura" className="space-y-4">
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Apertura de Platos del Día</CardTitle>
                  <CardDescription>Define la cantidad inicial de platos para el día</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {availablePlatos.map((plato) => (
                  <div key={plato.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-1">
                      <p className="font-medium">{plato.nombre}</p>
                    </div>
                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Cantidad"
                        value={aperturaPlatos[plato.id] || ""}
                        onChange={(e) =>
                          setAperturaPlatos({
                            ...aperturaPlatos,
                            [plato.id]: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-[#418B24] hover:bg-[#418B24]/90" onClick={handleGuardarApertura}>
                Guardar Apertura
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Ingreso de Bebidas */}
        <TabsContent value="ingreso" className="space-y-4">
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <CardTitle>Ingreso de Bebidas</CardTitle>
              <CardDescription>Registra ingresos de bebidas al stock global</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-[#FFC700] hover:bg-[#FFC700]/90 text-black"
                onClick={() => setShowIngresoBebidaDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Ingreso de Bebida
              </Button>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bebida</TableHead>
                      <TableHead className="text-right">Stock Actual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bebidas.map((bebida) => (
                      <TableRow key={bebida.id}>
                        <TableCell className="font-medium">{bebida.producto_nombre}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-[#418B24] text-white">{bebida.stock_global}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Mermas */}
        <TabsContent value="mermas" className="space-y-4">
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <CardTitle>Registro de Mermas</CardTitle>
              <CardDescription>Registra pérdidas o desperdicios de platos y bebidas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-[#870903] hover:bg-[#870903]/90" onClick={() => setShowMermaDialog(true)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Registrar Merma
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Ingreso de Bebida */}
      <Dialog open={showIngresoBebidaDialog} onOpenChange={setShowIngresoBebidaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Ingreso de Bebida</DialogTitle>
            <DialogDescription>Agregue bebidas al stock global</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bebida">Bebida</Label>
              <Select
                value={ingresoBebida.bebida_id}
                onValueChange={(v) => setIngresoBebida({ ...ingresoBebida, bebida_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar bebida" />
                </SelectTrigger>
                <SelectContent>
                  {availableBebidas.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={ingresoBebida.cantidad}
                onChange={(e) => setIngresoBebida({ ...ingresoBebida, cantidad: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <Input
                id="motivo"
                value={ingresoBebida.motivo}
                onChange={(e) => setIngresoBebida({ ...ingresoBebida, motivo: e.target.value })}
                placeholder="Ej: Compra semanal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIngresoBebidaDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#418B24] hover:bg-[#418B24]/90" onClick={handleRegistrarIngreso}>
              Registrar Ingreso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Registrar Merma */}
      <Dialog open={showMermaDialog} onOpenChange={setShowMermaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Merma</DialogTitle>
            <DialogDescription>Registre pérdidas o desperdicios</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={mermaData.tipo}
                onValueChange={(v: "PLATO" | "BEBIDA") => setMermaData({ ...mermaData, tipo: v, producto_id: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLATO">Plato</SelectItem>
                  <SelectItem value="BEBIDA">Bebida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mermaData.tipo === "PLATO" && (
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={mermaData.fecha}
                  onChange={(e) => setMermaData({ ...mermaData, fecha: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>{mermaData.tipo === "PLATO" ? "Plato" : "Bebida"}</Label>
              <Select
                value={mermaData.producto_id}
                onValueChange={(v) => setMermaData({ ...mermaData, producto_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {(mermaData.tipo === "PLATO" ? availablePlatos : availableBebidas).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                min="1"
                value={mermaData.cantidad}
                onChange={(e) => setMermaData({ ...mermaData, cantidad: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Motivo</Label>
              <Input
                value={mermaData.motivo}
                onChange={(e) => setMermaData({ ...mermaData, motivo: e.target.value })}
                placeholder="Ej: Producto en mal estado"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMermaDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#870903] hover:bg-[#870903]/90" onClick={handleRegistrarMerma}>
              Registrar Merma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
