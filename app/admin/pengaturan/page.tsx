import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { PengaturanForm } from "@/components/admin/pengaturan-form";
import type { Pengaturan } from "@/types";


const DEFAULT_PENGATURAN: Pengaturan = {
  id: 1,
  no_hp_pemilik: "6281234567890",
  bca_nomor: "1234567890",
  bca_atas_nama: "Nama Pemilik Rental",
  mandiri_nomor: "9876543210",
  mandiri_atas_nama: "Nama Pemilik Rental",
  updated_at: new Date().toISOString(),
};

export default async function AdminPengaturanPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pengaturan")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const pengaturan = (data as Pengaturan | null) ?? DEFAULT_PENGATURAN;

  return (
    <main className="min-h-screen bg-road-50/40">
      <AdminHeader active="pengaturan" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-xl font-extrabold text-road-900">
          Pengaturan Website
        </h1>
        <p className="mt-1 text-sm text-road-900/60">
          Ubah no. WhatsApp pemilik dan rekening pembayarn tanpa perlu
          deploy ulang
        </p>
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Gagal memuat data: {error.message}
          </p>
        )}
        <div className="mt-6">
          <PengaturanForm data={pengaturan} />
        </div>
      </div>
    </main>
  );
}