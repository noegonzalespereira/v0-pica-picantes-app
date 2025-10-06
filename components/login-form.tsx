"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { login } from "@/lib/auth"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // TODO: Integrate with NestJS backend API
    try {
      // Simulated login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (username && password) {
        login({
          id: "1",
          name: username,
          email: `${username}@elpuntopicante.com`,
          role: "gerente",
        })
        router.push("/dashboard/gerente")
      } else {
        setError("Por favor ingrese usuario y contraseña")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#FEFBE8] rounded-3xl p-8 shadow-2xl">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-32">
          <Image src="/logo.png" alt="Pica Picantes Logo" fill className="object-contain" priority />
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[#870903] rounded-3xl p-8 shadow-xl border-4 border-[#6a0702]">
        <h1 className="text-white text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Usuario Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-white text-sm font-medium block">
              Usuario:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-[#1A4734] border-[#1A4734] text-white placeholder:text-white/50 h-12 rounded-lg focus:ring-2 focus:ring-[#418B24] focus:border-[#418B24]"
                required
              />
            </div>
          </div>

          {/* Contraseña Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-white text-sm font-medium block">
              Contraseña:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#1A4734] border-[#1A4734] text-white placeholder:text-white/50 h-12 rounded-lg focus:ring-2 focus:ring-[#418B24] focus:border-[#418B24]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-[#870903] font-bold h-12 rounded-full shadow-lg hover:shadow-xl transition-all text-base"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Ingresar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
