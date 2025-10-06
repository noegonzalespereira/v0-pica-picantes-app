"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Download,
  AlertTriangle,
  Printer,
  CreditCard,
  Banknote,
  UtensilsCrossed,
  ShoppingBag,
  Shuffle,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for reports
const dailySalesData = [
  { day: "Lun", ventas: 4500, ordenes: 45 },
  { day: "Mar", ventas: 5200, ordenes: 52 },
  { day: "Mié", ventas: 4800, ordenes: 48 },
  { day: "Jue", ventas: 6100, ordenes: 61 },
  { day: "Vie", ventas: 7800, ordenes: 78 },
  { day: "Sáb", ventas: 9200, ordenes: 92 },
  { day: "Dom", ventas: 8500, ordenes: 85 },
]

const monthlySalesData = [
  { mes: "Ene", ventas: 125000 },
  { mes: "Feb", ventas: 132000 },
  { mes: "Mar", ventas: 145000 },
  { mes: "Abr", ventas: 138000 },
  { mes: "May", ventas: 155000 },
  { mes: "Jun", ventas: 168000 },
]

const topSellingProducts = [
  { name: "Tacos al Pastor", quantity: 245, revenue: 3062.5 },
  { name: "Burrito Picante", quantity: 189, revenue: 2929.5 },
  { name: "Nachos Supreme", quantity: 156, revenue: 2184.0 },
  { name: "Quesadilla de Pollo", quantity: 142, revenue: 1633.0 },
  { name: "Enchiladas Verdes", quantity: 128, revenue: 1728.0 },
]

const lowSellingProducts = [
  { name: "Sopa de Tortilla", quantity: 12, revenue: 156.0 },
  { name: "Flan Napolitano", quantity: 18, revenue: 144.0 },
  { name: "Tostadas de Tinga", quantity: 22, revenue: 198.0 },
]

const productSalesDetail = [
  { name: "Tacos al Pastor", type: "PLATO", quantity: 245 },
  { name: "Burrito Picante", type: "PLATO", quantity: 189 },
  { name: "Nachos Supreme", type: "PLATO", quantity: 156 },
  { name: "Quesadilla de Pollo", type: "PLATO", quantity: 142 },
  { name: "Agua de Horchata", type: "BEBIDA", quantity: 98 },
  { name: "Refresco", type: "BEBIDA", quantity: 87 },
  { name: "Agua de Jamaica", type: "BEBIDA", quantity: 76 },
]

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState("today")

  const handleExport = () => {
    console.log("[v0] Exporting report:", { dateRange })
    alert("Exportando reporte...")
  }

  const handlePrintCierre = () => {
    console.log("[v0] Printing cierre del día")
    window.print()
  }

  const todaySales = dailySalesData[dailySalesData.length - 1]
  const todayRevenue = todaySales.ventas
  const todayOrders = todaySales.ordenes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Métricas de ventas y rendimiento</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-[#418B24]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dateRange === "today" ? "Hoy" : "Período seleccionado"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#FFC700]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{todayOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dateRange === "today" ? "Hoy" : "Período seleccionado"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#418B24]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendido en Efectivo</CardTitle>
            <Banknote className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$5,100</div>
            <p className="text-xs text-muted-foreground mt-1">52 pedidos (61%)</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#FFC700]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendido en QR</CardTitle>
            <CreditCard className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$3,400</div>
            <p className="text-xs text-muted-foreground mt-1">33 pedidos (39%)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-[#870903]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Para Comer</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-[#870903]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">48</div>
            <p className="text-xs text-muted-foreground mt-1">56% del total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#418B24]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Para Llevar</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">32</div>
            <p className="text-xs text-muted-foreground mt-1">38% del total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#FFC700]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Mixtos</CardTitle>
            <Shuffle className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">6% del total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ventas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ventas">Ventas</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="utilidad">Utilidad</TabsTrigger>
          <TabsTrigger value="mermas">Mermas</TabsTrigger>
          <TabsTrigger value="cierre">Cierre del Día</TabsTrigger>
        </TabsList>

        <TabsContent value="ventas" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Tendencia Diaria</CardTitle>
                <CardDescription>Ventas por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ventas: {
                      label: "Ventas",
                      color: "#418B24",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="ventas" fill="#418B24" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Tendencia Mensual</CardTitle>
                <CardDescription>Evolución de ventas por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ventas: {
                      label: "Ventas",
                      color: "#FFC700",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="mes" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="ventas" stroke="#FFC700" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-2 border-[#418B24]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#418B24]" />
                  Platos Más Vendidos
                </CardTitle>
                <CardDescription>Top 5 productos con mayor demanda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSellingProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-[#418B24]/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#418B24] text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.revenue.toFixed(2)} en ventas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#418B24]">{product.quantity}</p>
                        <p className="text-xs text-muted-foreground">unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#870903]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[#870903]" />
                  Platos Menos Vendidos
                </CardTitle>
                <CardDescription>Productos con menor demanda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowSellingProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-[#870903]/5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#870903] text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.revenue.toFixed(2)} en ventas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#870903]">{product.quantity}</p>
                        <p className="text-xs text-muted-foreground">unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-primary/10">
            <CardHeader>
              <CardTitle>Detalle de Productos Vendidos</CardTitle>
              <CardDescription>Cantidad vendida de cada plato y bebida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Cantidad Vendida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSalesDetail.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.type === "PLATO"
                                ? "bg-[#870903]/10 text-[#870903]"
                                : "bg-[#FFC700]/20 text-[#1A4734]"
                            }`}
                          >
                            {product.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos" className="space-y-4">
          <Card className="border-2 border-[#870903]/20">
            <CardHeader>
              <CardTitle>Resumen de Gastos</CardTitle>
              <CardDescription>Gastos registrados en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Total de Gastos</Label>
                  <p className="text-2xl font-bold text-[#870903]">$232.50</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Número de Gastos</Label>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Gasto Promedio</Label>
                  <p className="text-2xl font-bold text-foreground">$77.50</p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Caja</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">Verduras frescas</TableCell>
                      <TableCell>Compra de verduras para la semana</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>$12.50</TableCell>
                      <TableCell className="font-semibold">$62.50</TableCell>
                      <TableCell>Caja 1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{new Date(Date.now() - 86400000).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">Gas para cocina</TableCell>
                      <TableCell>Recarga de tanque de gas</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>$85.00</TableCell>
                      <TableCell className="font-semibold">$85.00</TableCell>
                      <TableCell>Caja 2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{new Date(Date.now() - 172800000).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">Servilletas y vasos</TableCell>
                      <TableCell>Material desechable</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>$8.50</TableCell>
                      <TableCell className="font-semibold">$85.00</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilidad" className="space-y-4">
          <Card className="border-2 border-[#418B24]/20">
            <CardHeader>
              <CardTitle>Utilidad Teórica</CardTitle>
              <CardDescription>Análisis de margen basado en costos teóricos de recetas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ventas Totales</Label>
                  <p className="text-2xl font-bold text-foreground">$46,200.00</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Costo Teórico</Label>
                  <p className="text-2xl font-bold text-[#870903]">$18,480.00</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Utilidad Estimada</Label>
                  <p className="text-2xl font-bold text-[#418B24]">$27,720.00</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Margen %</Label>
                  <p className="text-2xl font-bold text-[#418B24]">60%</p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Unidades Vendidas</TableHead>
                      <TableHead>Precio Venta</TableHead>
                      <TableHead>Costo Teórico</TableHead>
                      <TableHead>Margen Unit.</TableHead>
                      <TableHead>Utilidad Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Tacos al Pastor</TableCell>
                      <TableCell>245</TableCell>
                      <TableCell>$12.50</TableCell>
                      <TableCell>$4.85</TableCell>
                      <TableCell className="text-[#418B24]">$7.65 (61%)</TableCell>
                      <TableCell className="font-semibold text-[#418B24]">$1,874.25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Burrito Picante</TableCell>
                      <TableCell>189</TableCell>
                      <TableCell>$15.50</TableCell>
                      <TableCell>$6.20</TableCell>
                      <TableCell className="text-[#418B24]">$9.30 (60%)</TableCell>
                      <TableCell className="font-semibold text-[#418B24]">$1,757.70</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nachos Supreme</TableCell>
                      <TableCell>156</TableCell>
                      <TableCell>$14.00</TableCell>
                      <TableCell>$5.60</TableCell>
                      <TableCell className="text-[#418B24]">$8.40 (60%)</TableCell>
                      <TableCell className="font-semibold text-[#418B24]">$1,310.40</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mermas" className="space-y-4">
          <Card className="border-2 border-[#FFC700]/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#FFC700]" />
                <div>
                  <CardTitle>Registro de Mermas</CardTitle>
                  <CardDescription>Pérdidas y desperdicios registrados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Total Mermas (Platos)</Label>
                  <p className="text-2xl font-bold text-foreground">15 unidades</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Total Mermas (Bebidas)</Label>
                  <p className="text-2xl font-bold text-foreground">8 unidades</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Costo Estimado</Label>
                  <p className="text-2xl font-bold text-[#870903]">$142.50</p>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Costo Est.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-[#870903]/10 text-[#870903]">PLATO</span>
                      </TableCell>
                      <TableCell className="font-medium">Tacos al Pastor</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>Sobreproducción</TableCell>
                      <TableCell className="text-[#870903]">$24.25</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-[#FFC700]/20 text-[#1A4734]">BEBIDA</span>
                      </TableCell>
                      <TableCell className="font-medium">Agua de Horchata</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>Derrame accidental</TableCell>
                      <TableCell className="text-[#870903]">$10.50</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cierre" className="space-y-4">
          <Card className="border-2 border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cierre del Día</CardTitle>
                  <CardDescription>Consolidado imprimible del día {new Date().toLocaleDateString()}</CardDescription>
                </div>
                <Button onClick={handlePrintCierre} className="bg-[#418B24] hover:bg-[#1A4734]">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen de Ventas */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#870903]">Resumen de Ventas</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Total Ventas</Label>
                    <p className="text-xl font-bold">$8,500.00</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Órdenes</Label>
                    <p className="text-xl font-bold">85</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">Ticket Promedio</Label>
                    <p className="text-xl font-bold">$100.00</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-sm">IVA</Label>
                    <p className="text-xl font-bold">$1,360.00</p>
                  </div>
                </div>
              </div>

              {/* Métodos de Pago */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#870903]">Métodos de Pago</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-[#418B24]/5">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Efectivo</p>
                          <p className="text-2xl font-bold text-[#418B24]">$5,100.00</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-[#418B24]" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">52 órdenes (61%)</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#FFC700]/10">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">QR / Transferencia</p>
                          <p className="text-2xl font-bold text-[#1A4734]">$3,400.00</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-[#FFC700]" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">33 órdenes (39%)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Gastos del Turno */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#870903]">Gastos del Turno</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Verduras frescas</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell className="text-right">$62.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Total Gastos</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold text-[#870903]">$62.50</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Productos Vendidos */}
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#870903]">Productos Vendidos</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground">Platos</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Tacos al Pastor</TableCell>
                            <TableCell className="text-right font-semibold">35</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Burrito Picante</TableCell>
                            <TableCell className="text-right font-semibold">28</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Nachos Supreme</TableCell>
                            <TableCell className="text-right font-semibold">22</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm text-muted-foreground">Bebidas</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Agua de Horchata</TableCell>
                            <TableCell className="text-right font-semibold">42</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Refresco</TableCell>
                            <TableCell className="text-right font-semibold">38</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Agua de Jamaica</TableCell>
                            <TableCell className="text-right font-semibold">25</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen Final */}
              <Card className="bg-[#418B24]/5 border-[#418B24]">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ventas del Día</span>
                      <span className="font-semibold">$8,500.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gastos del Turno</span>
                      <span className="font-semibold text-[#870903]">-$62.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monto Apertura Caja</span>
                      <span className="font-semibold">$500.00</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-bold text-lg">Efectivo Esperado en Caja</span>
                      <span className="font-bold text-lg text-[#418B24]">$5,537.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
