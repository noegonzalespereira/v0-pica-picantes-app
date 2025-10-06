"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { RoleSelector } from "@/components/role-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, router])

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="border-2 border-primary/20 mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Seleccione su Rol</CardTitle>
          <CardDescription>Elija el rol con el que desea ingresar al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <RoleSelector />
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Demo: Seleccione cualquier rol para explorar el sistema</p>
      </div>
    </div>
  )
}
