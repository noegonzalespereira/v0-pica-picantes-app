"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, CreditCard, BarChart3 } from "lucide-react"
import { setCurrentUser, type UserRole } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function RoleSelector() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const roles: Array<{ role: UserRole; name: string; description: string; icon: typeof ChefHat; color: string }> = [
    {
      role: "gerente",
      name: "Gerente",
      description: "Gestión completa, reportes e inventario",
      icon: BarChart3,
      color: "bg-[#870903] hover:bg-[#870903]/90",
    },
    {
      role: "cajero",
      name: "Cajero",
      description: "Toma de pedidos y pagos",
      icon: CreditCard,
      color: "bg-[#FFC700] hover:bg-[#FFC700]/90 text-black",
    },
    {
      role: "cocina",
      name: "Cocina",
      description: "Preparación de pedidos",
      icon: ChefHat,
      color: "bg-[#418B24] hover:bg-[#418B24]/90",
    },
  ]

  const handleRoleSelect = (role: UserRole) => {
    setIsLoading(true)
    // Mock user creation
    setCurrentUser({
      id: Math.random().toString(36).substr(2, 9),
      username: role,
      name: `Usuario ${role}`,
      role,
    })

    // Redirect to role-specific dashboard
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {roles.map(({ role, name, description, icon: Icon, color }) => (
        <Card key={role} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className={`p-4 rounded-full ${color.split(" ")[0]}/10`}>
                <Icon
                  className={`w-8 h-8 ${color.includes("text-black") ? "text-[#FFC700]" : color.split(" ")[0].replace("bg-", "text-")}`}
                />
              </div>
            </div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleRoleSelect(role)} className={`w-full ${color}`} disabled={isLoading}>
              Ingresar como {name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
