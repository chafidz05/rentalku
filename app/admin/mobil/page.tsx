import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { MobilTable } from "@/components/admin/mobil-table";
import { MobilForm } from "@/components/admin/mobil-form";
import type { Mobil } from "@/types";

export default async function AdminMobilPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mobil")
    .select("*")
    .order("created_at", { ascending: true });

  const mobil = (data ?? []) as Mobil[];

  return (
    <main className="min-h-screen bg-road-50/40">
      <AdminHeader active="mobil" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-extrabold text-road-900">
              Data Mobil
            </h1>
            <p className="mt-1 text-sm text-road-900/60">
              Mobil yang ditandai &ldquo;Tersedia&rdquo; akan otomatis muncul
              di landing page.
            </p>
          </div>
          <MobilForm />
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Gagal memuat data: {error.message}
          </p>
        )}

        <div className="mt-6">
          <MobilTable data={mobil} />
        </div>
      </div>
    </main>
  );
}