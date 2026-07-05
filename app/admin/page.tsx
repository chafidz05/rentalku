import { createClient } from "@/lib/supabase/server";
import { PeminjamTable } from "@/components/admin/peminjam-table";
import { AdminHeader } from "@/components/admin/admin-header";
import type { Peminjam } from "@/types";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("peminjam")
    .select("*, mobil:mobil_id(id, nama)")
    .order("created_at", { ascending: false });

  const peminjam = (data ?? []) as unknown as Peminjam[];

  return (
    <main className="min-h-screen bg-road-50/40">
      <AdminHeader active="peminjam" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-xl font-extrabold text-road-900">
          Daftar Pengajuan Sewa
        </h1>
        <p className="mt-1 text-sm text-road-900/60">
          Data diambil langsung dari tabel <code>peminjam</code> di Supabase.
        </p>
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Gagal memuat data: ${error.message}
          </p>
        )}
        <div className="mt-6">
          <PeminjamTable data={peminjam} />
        </div>
      </div>
    </main>
  );
};