import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Fuel, Gauge } from "lucide-react";
import type { Mobil } from "@/types";

export async function Armada() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mobil")
    .select("*")
    .eq("tersedia", true)
    .order("created_at", { ascending: true });

  const daftarMobil = (data ?? []) as Mobil[];

  return (
    <section id="armada" className="bg-road-50/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold text-road-900 sm:text-3xl">
          Mobil Tersedia
        </h2>
        <p className="mt-2 max-w-xl text-road-900/70">
          Saat ini kami fokus melayani dengan satu unit andalan, terawat dan
          siap pakai untuk perjalanan kamu.
        </p>
        {daftarMobil.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-road-200 p-8 text-center text-sm text-road-900/60">
            Belum ada mobil yang tersedia saat ini. Silahkan cek lagi nanti.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {daftarMobil.map((mobil) => (
              <div
                key={mobil.id}
                className="overflow-hidden rounded-2xl border border-road-100 bg-white shadow-sm sm:flex sm:items-stretch"
              >
                <div className="flex items-center justify-center bg-road-100 p-10 sm:w-2/5">
                  <span className="text-7xl">🚗</span>
                </div>
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-road-900">
                        {mobil.nama}
                      </h3>
                      <Badge variant="secondary" className="mt-1.5">
                        {mobil.tipe}
                      </Badge>
                    </div>
                    <p className="text-right">
                      <span className="font-display text-2xl font-extrabold text-road-600">
                        Rp{mobil.harga_harian.toLocaleString("id-ID")}
                      </span>
                      <span className="block text-xs font-medium text-road-900/50">
                        per hari
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-road-900/70">
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-road-50 py-3">
                      {mobil.kapasitas} orang
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-road-50 py-3">
                      <Gauge className="h-4 w-4 text-road-600" />
                      {mobil.transmisi}
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-road-50 py-3">
                      <Fuel className="h-4 w-4 text-road-600" />
                      {mobil.bahan_bakar}
                    </div>
                  </div>
                  <Button size="lg" className="mt-6 w-full sm:w-fit" asChild>
                    <a href="#kontak">Sewa {mobil.nama} ini</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};