import { umkmService } from "@/lib/supabase"
import EditUMKMClient from "./EditUMKMClient"

// Tambahkan generateStaticParams untuk static export
export async function generateStaticParams() {
  // Ambil semua ID UMKM yang valid dari service
  // Karena umkmService.getAll() bisa berjalan di server, ini aman.
  // Perhatikan bahwa ini akan mengambil semua UMKM tanpa filter user/admin
  // karena generateStaticParams berjalan saat build time.
  const allUmkm = await umkmService.getAll()

  return allUmkm.map((umkm) => ({
    id: umkm.id!, // Pastikan ID ada dan string
  }))
}

export default function EditUMKM() {
  return <EditUMKMClient />
}
