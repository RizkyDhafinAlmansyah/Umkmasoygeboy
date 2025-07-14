"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Lock, User, Eye, EyeOff, Loader2, UserPlus, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { RegisterForm } from "./register-form"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError("Username atau password salah")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  if (showRegister) {
    return <RegisterForm onBackToLogin={() => setShowRegister(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Sistem Pendataan UMKM</h1>
          <p className="text-gray-600 text-lg">Platform manajemen UMKM mikro RT/RW</p>
          <p className="text-gray-500 text-sm mt-2">Kelola data usaha mikro dengan mudah dan efisien</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-gray-900">Masuk ke Sistem</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Akses dashboard dan kelola data UMKM
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda"
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Masuk ke Dashboard
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">atau</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 transition-colors bg-transparent"
                  onClick={() => setShowRegister(true)}
                  disabled={isLoading}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Daftar Akun Baru
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">© 2024 Sistem Pendataan UMKM</p>
          <p className="text-xs text-gray-400 mt-1">Dikembangkan untuk RT/RW Indonesia</p>
        </div>
      </div>
    </div>
  )
}
