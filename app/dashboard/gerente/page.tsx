import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Users, Wallet, Receipt } from "lucide-react"
import Link from "next/link"

export default function GerenteDashboard() {
  const stats = [
    {
      title: "Ventas Hoy",
      value: "$2,450.00",
      change: "+12.5%",
      icon: DollarSign,
      bgColor: "bg-[#418B24]",
      textColor: "text-white",
    },
    {
      title: "Pedidos Activos",
      value: "8",
      change: "3 en cocina",
      icon: ShoppingCart,
      bgColor: "bg-[#FFC700]",
      textColor: "text-[#1A4734]",
    },
    {
      title: "Productos Bajo Stock",
      value: "5",
      change: "Requiere atención",
      icon: Package,
      bgColor: "bg-[#870903]",
      textColor: "text-white",
    },
    {
      title: "Clientes Atendidos",
      value: "42",
      change: "+8 vs ayer",
      icon: Users,
      bgColor: "bg-[#1A4734]",
      textColor: "text-white",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#870903] to-[#1A4734] rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Dashboard Gerente</h1>
        <p className="text-white/80 mt-1">Vista general del restaurante El Punto Picante</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={`${stat.bgColor} border-0 shadow-lg`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${stat.textColor}/80`}>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
                    <p className={`text-xs ${stat.textColor}/70 mt-1`}>{stat.change}</p>
                  </div>
                  <Icon className={`h-10 w-10 ${stat.textColor}/30`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-[#418B24]/20 shadow-md">
          <CardHeader className="bg-[#418B24]/5">
            <CardTitle className="flex items-center gap-2 text-[#1A4734]">
              <TrendingUp className="h-5 w-5" />
              Ventas de la Semana
            </CardTitle>
            <CardDescription>Resumen de ventas de los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1A4734] w-12">{day}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 bg-[#FEFBE8] rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#418B24] to-[#1A4734] rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${((i + 1) / 7) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">${(i + 1) * 350}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#870903]/20 shadow-md">
          <CardHeader className="bg-[#870903]/5">
            <CardTitle className="flex items-center gap-2 text-[#870903]">
              <BarChart3 className="h-5 w-5" />
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>Top 5 productos del día</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                { name: "Tacos al Pastor", qty: 45 },
                { name: "Burrito Picante", qty: 38 },
                { name: "Quesadilla", qty: 32 },
                { name: "Nachos Supreme", qty: 28 },
                { name: "Enchiladas", qty: 24 },
              ].map((product, i) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FEFBE8] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#870903] to-[#1A4734] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-[#1A4734]">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#418B24]">{product.qty}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-[#FFC700]/30 shadow-md">
        <CardHeader className="bg-[#FFC700]/10">
          <CardTitle className="text-[#1A4734]">Accesos Rápidos</CardTitle>
          <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Inventario", icon: Package, href: "/dashboard/inventario", color: "#418B24" },
              { name: "Reportes", icon: BarChart3, href: "/dashboard/reportes", color: "#870903" },
              { name: "Gastos", icon: Wallet, href: "/dashboard/gastos", color: "#1A4734" },
              { name: "Recetas", icon: Receipt, href: "/dashboard/recetas", color: "#FFC700" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 hover:shadow-lg transition-all cursor-pointer"
                    style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}05` }}
                  >
                    <Icon className="h-8 w-8" style={{ color: item.color }} />
                    <span className="text-sm font-medium text-[#1A4734]">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
