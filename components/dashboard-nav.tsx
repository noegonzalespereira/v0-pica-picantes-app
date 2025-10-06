"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart3, ChefHat, Home, LogOut, Package, Receipt, ShoppingCart, Users, Wallet } from "lucide-react"
import { getCurrentUser, logout, getRoleName, type UserRole } from "@/lib/auth"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: typeof Home
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["gerente", "cajero", "cocina"],
  },
  {
    title: "Pedidos",
    href: "/dashboard/pedidos",
    icon: ShoppingCart,
    roles: ["cajero", "gerente"],
  },
  {
    title: "Cocina",
    href: "/dashboard/cocina",
    icon: ChefHat,
    roles: ["cocina", "gerente"],
  },
  {
    title: "Inventario",
    href: "/dashboard/inventario",
    icon: Package,
    roles: ["gerente"],
  },
  {
    title: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
    roles: ["gerente"],
  },
  {
    title: "Gastos",
    href: "/dashboard/gastos",
    icon: Wallet,
    roles: ["gerente"],
  },
  {
    title: "Recetas",
    href: "/dashboard/recetas",
    icon: Receipt,
    roles: ["gerente"],
  },
  {
    title: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users,
    roles: ["gerente"],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">El Punto Picante</span>
            <span className="text-xs text-muted-foreground">Sistema POS</span>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="mb-3 rounded-lg bg-muted p-3">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user && getRoleName(user.role)}</p>
        </div>
        <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
