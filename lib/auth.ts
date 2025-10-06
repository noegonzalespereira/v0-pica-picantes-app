// Mock authentication utilities
// TODO: Replace with actual NestJS API integration

export type UserRole = "gerente" | "cajero" | "cocina"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Mock current user - in production, this would come from session/JWT
let currentUser: User | null = null

export function login(user: User) {
  currentUser = user
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export const setCurrentUser = login

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined" && !currentUser) {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      currentUser = JSON.parse(stored)
    }
  }
  return currentUser
}

export function logout() {
  currentUser = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export function getRoleName(role: UserRole): string {
  const names = {
    gerente: "Gerente",
    cajero: "Cajero",
    cocina: "Cocina",
  }
  return names[role]
}

export function getRoleColor(role: UserRole): string {
  const colors = {
    gerente: "text-[#870903]",
    cajero: "text-[#FFC700]",
    cocina: "text-[#418B24]",
  }
  return colors[role]
}
