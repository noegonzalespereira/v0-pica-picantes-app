"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertCircle, ChefHat } from "lucide-react"
import { mockOrders } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

const mockKitchenOrders: Order[] = mockOrders.filter((order) => order.estado_pedido === "PENDIENTE")

export default function CocinaDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockKitchenOrders)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getElapsedTime = (createdAt: Date): string => {
    const elapsed = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000 / 60)
    return `${elapsed} min`
  }

  const markAsReady = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, estado_pedido: "LISTO" as const, updatedAt: new Date() } : order,
      ),
    )
    setTimeout(() => {
      setOrders(orders.filter((order) => order.id !== orderId))
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#870903]">Pantalla de Cocina</h1>
          <p className="text-muted-foreground">Pedidos pendientes de preparación</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString("es-MX")}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-[#870903]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Pendientes</CardTitle>
            <ChefHat className="h-4 w-4 text-[#870903]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">En preparación</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#418B24]/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            <AlertCircle className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#418B24]">Activo</div>
            <p className="text-xs text-muted-foreground mt-1">Sistema operando</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {orders.length === 0 ? (
          <Card className="border-2 border-[#418B24]/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-16 w-16 text-[#418B24] mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hay pedidos pendientes</h3>
              <p className="text-muted-foreground">Todos los pedidos están listos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((order) => {
                const elapsed = getElapsedTime(order.createdAt)

                return (
                  <Card
                    key={order.id}
                    className="border-2 border-[#418B24]/20 hover:border-[#418B24]/40 transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-[#870903]">#{order.id.slice(-8)}</CardTitle>
                        <Badge className="bg-[#FFC700] hover:bg-[#FFC700]/90 text-[#1A4734]">PENDIENTE</Badge>
                      </div>
                      <CardDescription className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {order.tipo} {order.num_mesa && `- Mesa ${order.num_mesa}`}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#418B24]">
                          <Clock className="h-3 w-3" />
                          {elapsed}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="border-l-4 border-[#418B24] pl-3 py-2 bg-[#FEFBE8] rounded-r">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-[#1A4734]">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#418B24] text-white text-xs font-bold mr-2">
                                    {item.quantity}
                                  </span>
                                  {item.product.name}
                                </p>
                                {order.tipo === "MIXTO" && item.destino && (
                                  <Badge variant="outline" className="text-xs mt-1 border-[#870903]/30">
                                    {item.destino === "MESA" ? "Para Mesa" : "Para Llevar"}
                                  </Badge>
                                )}
                                {item.notes && (
                                  <div className="mt-1 flex items-start gap-1">
                                    <AlertCircle className="h-3 w-3 text-[#FFC700] mt-0.5 shrink-0" />
                                    <p className="text-sm text-[#870903] font-medium italic">{item.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-[#418B24] hover:bg-[#418B24]/90 font-semibold text-white"
                        onClick={() => markAsReady(order.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marcar como Listo
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
