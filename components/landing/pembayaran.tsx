import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Info } from "lucide-react";
import type { Pengaturan } from "@/types";

const DEFAULT_PENGATURAN = {
  bca_nomor: "1234567890",
  bca_atas_nama: "Nama Pemilik Rental",
  mandiri_nomor: "9876543210",
  mandiri_atas_nama: "Nama Pemilik Rental",
};

export async function Pembayaran() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pengaturan")
    .select("bca_nomor, bca_atas_nama, mandiri_nomor, mandiri_atas_nama")
    .eq("id", 1)
    .maybeSingle();

  const pengaturan = (data as Partial<Pengaturan> | null) ?? DEFAULT_PENGATURAN;

  const rekening = [
    {
      bank: "BCA",
      nomor: pengaturan.bca_nomor ?? DEFAULT_PENGATURAN.bca_nomor,
      atasNama: pengaturan.bca_atas_nama ?? DEFAULT_PENGATURAN.bca_atas_nama,
    },
    {
      bank: "Mandiri",
      nomor: pengaturan.mandiri_nomor ?? DEFAULT_PENGATURAN.mandiri_nomor,
      atasNama: pengaturan.mandiri_atas_nama ?? DEFAULT_PENGATURAN.mandiri_atas_nama,
    },
  ];

  return (
    <section id="pembayaran" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h2 className="font-display text-2xl font-extrabold text-road-900 sm:text-3xl">
        Informasi Pembayaran
      </h2>
      <p className="mt-2 max-w-xl text-road-900/70">
        Pembayaran dilakukan melalui transfer bank berikut. Setelah transfer
        dan bukti pembayaran dikonfirmasi lewat WhatsApp, kami akan
        mengirimkan lokasi mobil untuk diambil, atau mengantarkan mobil
        langsung ke lokasi yang kamu tentukan.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {rekening.map((r) => (
          <Card key={r.bank}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-road-100 text-road-600">
                  <Landmark className="h-5 w-5" />
                </span>
                <CardTitle>Bank {r.bank}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-display text-xl font-extrabold tracking-wide text-road-900">{r.nomor}</p>
              <p className="mt-1 text-sm text-road-900/60">a.n. {r.atasNama}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-road-50 p-4 text-sm text-road-900/70">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-road-600" />
        <p>
          Website ini belum memproses transaksi pembayaran secara otomatis.
          Semua transfer dilakukan manual lalu dikonfirmasi lewat WhatsApp.
        </p>
      </div>
    </section>
  );
};