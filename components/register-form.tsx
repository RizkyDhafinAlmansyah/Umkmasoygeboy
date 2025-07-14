"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, User, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { useAuth, type RegisterData } from "@/lib/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegisterFormProps {
  onBackToLogin: () => void
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  // Update default RW dan validasi untuk hanya RW 01 dan 04
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    password: "",
    name: "",
    rw: "01", // Default RW 01
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!formData.username || !formData.password || !formData.name || !formData.rw) {
      setError("Semua field harus diisi")
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    if (formData.password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      return
    }

    setIsLoading(true)

    try {
      const result = await register(formData)
      if (result.success) {
        setSuccess(result.message)
        // Reset form
        setFormData({
          username: "",
          password: "",
          name: "",
          rw: "01",
        })
        setConfirmPassword("")
        // Auto redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin()
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Terjadi kesalahan saat registrasi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Akun Baru</h1>
          <p className="text-gray-600">Buat akun untuk mengakses sistem RT/RW</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Registrasi</CardTitle>
            <CardDescription className="text-center">Lengkapi data diri Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Update form RW selection */}
                <div className="space-y-2">
                  <Label htmlFor="rw">RW</Label>
                  <Select value={formData.rw} onValueChange={(value) => handleChange("rw", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih RW" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">RW 01</SelectItem>
                      <SelectItem value="04">RW 04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="Pilih username"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="pr-10"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={onBackToLogin}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Login
              </Button>
            </form>

            {/* Update info section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Informasi:</h3>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Akun admin sudah ditetapkan untuk RW 01 dan RW 04</li>
                <li>• User hanya dapat mengelola data UMKM sendiri</li>
                <li>• Pastikan memilih RW yang sesuai dengan wilayah Anda</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Sistem Pendataan RT/RW</p>
        </div>
      </div>
    </div>
  )
}
