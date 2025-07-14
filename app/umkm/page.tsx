"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Download, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { umkmService, type UMKM } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"
import { useAuth } from "@/lib/auth"

function DataUMKMContent() {
  const [umkm, setUmkm] = useState<UMKM[]>([])
  const [filteredUmkm, setFilteredUmkm] = useState<UMKM[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJenis, setFilterJenis] = useState("semua")
  const [filterStatus, setFilterStatus] = useState("semua")
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadUMKM()
  }, [user])

  useEffect(() => {
    // Filter data based on search and filters
    let filtered = umkm.filter(
      (u) =>
        u.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.jenis_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.no_hp && u.no_hp.includes(searchTerm)),
    )

    if (filterJenis !== "semua") {
      filtered = filtered.filter((u) => u.jenis_usaha === filterJenis)
    }

    if (filterStatus !== "semua") {
      filtered = filtered.filter((u) => u.status === filterStatus)
    }

    setFilteredUmkm(filtered)
  }, [umkm, searchTerm, filterJenis, filterStatus])

  const loadUMKM = async () => {
    try {
      setLoading(true)

      let data: UMKM[] = []

      if (user?.role === "admin") {
        data = await umkmService.getAll(undefined, user.rw)
      } else {
        data = await umkmService.getAll(user?.id)
      }

      setUmkm(data)
      setFilteredUmkm(data)
    } catch (error) {
      console.error("Error loading UMKM:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data UMKM ini?")) {
      try {
        if (user?.role === "admin") {
          const umkmToDelete = umkm.find((u) => u.id === id)
          if (umkmToDelete?.user_id) {
            await umkmService.delete(id, umkmToDelete.user_id)
          }
        } else {
          await umkmService.delete(id, user?.id || "")
        }
        await loadUMKM()
        alert("Data UMKM berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting UMKM:", error)
        alert("Gagal menghapus data UMKM. Silakan coba lagi.")
      }
    }
  }

  const exportToCSV = () => {
    const headers = ["Nama Usaha", "Pemilik", "Jenis Usaha", "Nomor HP", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredUmkm.map((u) => [u.nama_usaha, u.pemilik, u.jenis_usaha, u.no_hp || "", u.status].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-umkm-${user?.role === "admin" ? `rw-${user.rw}` : "user"}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data UMKM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeaderWithAuth
        title={`Kelola Data UMKM ${user?.role === "admin" ? `RW ${user.rw}` : ""}`}
        description={`Manajemen lengkap data UMKM mikro ${user?.role === "admin" ? `di RW ${user.rw}` : "di wilayah Anda"}`}
      >
        <Button variant="outline" onClick={exportToCSV} className="border-gray-300 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/umkm/tambah">
            <Plus className="h-5 w-5 mr-2" />
            Tambah UMKM
          </Link>
        </Button>
      </HeaderWithAuth>

      <NavigationWithAuth />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Daftar UMKM Terdaftar</CardTitle>
            <CardDescription className="text-gray-600">
              Kelola dan pantau semua UMKM mikro di wilayah Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama usaha, pemilik, jenis usaha, atau nomor HP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={filterJenis} onValueChange={setFilterJenis}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Filter Jenis Usaha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="Kuliner">Kuliner</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Jasa">Jasa</SelectItem>
                  <SelectItem value="Perdagangan">Perdagangan</SelectItem>
                  <SelectItem value="Teknologi">Teknologi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  <SelectItem value="Tutup Sementara">Tutup Sementara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Nama Usaha</TableHead>
                    <TableHead className="font-semibold text-gray-900">Pemilik</TableHead>
                    <TableHead className="font-semibold text-gray-900">Jenis Usaha</TableHead>
                    <TableHead className="font-semibold text-gray-900">Nomor HP</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUmkm.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Tidak ada data UMKM</p>
                        <p className="text-gray-400 text-sm mt-1">Mulai dengan mendaftarkan UMKM pertama</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUmkm.map((u) => (
                      <TableRow key={u.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{u.nama_usaha}</TableCell>
                        <TableCell className="text-gray-700">{u.pemilik}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {u.jenis_usaha}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">{u.no_hp || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "Aktif"
                                ? "default"
                                : u.status === "Tidak Aktif"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              u.status === "Aktif"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : u.status === "Tidak Aktif"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-gray-300 hover:bg-gray-50 bg-transparent"
                            >
                              <Link href={`/umkm/edit/${u.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(u.id!)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function DataUMKM() {
  return (
    <ProtectedRoute>
      <DataUMKMContent />
    </ProtectedRoute>
  )
}
