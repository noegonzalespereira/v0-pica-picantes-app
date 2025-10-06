import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-[#2a2a2a]">
      <div className="text-sm text-gray-400 self-start mb-4">Iniciar sesión</div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
