import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CajeroDashboard() {
  const activeOrders = [
    { id: "001", table: "Mesa 5", items: 3, total: 45.5, time: "5 min" },
    { id: "002", table: "Mesa 2", items: 5, total: 78.0, time: "12 min" },
    { id: "003", table: "Para llevar", items: 2, total: 32.0, time: "3 min" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard Cajero</h1>
          <p className="text-muted-foreground">Gestión de pedidos y pagos</p>
        </div>
        <Link href="/dashboard/pedidos">
          <Button className="bg-[#418B24] hover:bg-[#418B24]/90">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Pedido
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Activos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#FFC700]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">En proceso</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas del Turno</CardTitle>
            <DollarSign className="h-4 w-4 text-[#418B24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1,245.50</div>
            <p className="text-xs text-muted-foreground mt-1">18 pedidos completados</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-[#870903]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8 min</div>
            <p className="text-xs text-muted-foreground mt-1">Por pedido</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle>Pedidos Activos</CardTitle>
          <CardDescription>Pedidos pendientes de pago o en preparación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC700]/10">
                    <span className="text-sm font-bold text-[#FFC700]">#{order.id}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{order.table}</p>
                    <p className="text-sm text-muted-foreground">{order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {order.time}
                    </p>
                  </div>
                  <Button size="sm" className="bg-[#418B24] hover:bg-[#418B24]/90">
                    Cobrar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
