import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-road-50">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:py-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-road-200 bg-white px-3 py-1 text-xs font-semibold text-road-600">
            🚗 Rental Mobil
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-road-900 sm:text-4xl lg:text-5xl">
            Sewa mobil, jalan tenang,
            <br className="hidden sm:block" /> sampai tujuan dengan aman.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-road-900/70 sm:text-lg">
            Layanan sewa mobil harian untuk perjalanan keluarga, bisnis,
            maupun liburan. Cukup isi data diri, tentukan tanggal dan lokasi.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#kontak">Ajukan Sewa Sekarang</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#armada">Lihat Pilihan Mobil</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-road-900/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-road-600" />
              Data penyewa terverifikasi
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-road-600" />
              Sesuai lokasi
            </span>
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-road-100 bg-white p-6 shadow-xl shadow-road-900/5 lg:max-w-sm">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-road-600">Proses Sewa</p>
          <ol className="mt-4 space-y-4">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-road-600 text-xs font-bold text-white">1</span>
              <p className="text-sm text-road-900/80">Isi formulir dengan nama, foto KTP, tanggal pinjam, dan lokasi</p>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-road-600 text-xs font-bold text-white">2</span>
              <p className="text-sm text-road-900/80">Tim kami menghubungi untuk konfirmasi mobil dan jadwal</p>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-road-600 text-xs font-bold text-white">3</span>
              <p className="text-sm text-road-900/80">
                Lakukan pembayaran transfer, lalu kami kirimkan lokasi mobil
                atau antarkan langsung mobilnya ke tempat kamu.
              </p>
            </li>
          </ol>
        </div>
      </div>
      <div className="road-divider" />
    </section>
  );
};