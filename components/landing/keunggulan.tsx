import { Clock, Wallet, Wrench } from "lucide-react";

const items = [
  {
    icon: Wallet,
    title: "Harga Bersahabat",
    desc: "Tarif harian jelas di awal, tanpa biaya tersembunyi.",
  },
  {
    icon: Wrench,
    title: "Unit Terawat",
    desc: "Mobil rutin diservis dan dicek sebelum diserahkan.",
  },
  {
    icon: Clock,
    title: "Respons Cepat",
    desc: "Konfirmasi pesanan lewat WhatsApp dalam hitungan menit.",
  },
];

export function Keunggulan() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-extrabold text-road-900 sm:text-3xl">
          Kenapa sewa di sini?
        </h2>
        <p className="mt-2 text-road-900-70">
          Usaha rental keluarga yang mengutamakan kenyamanan dan kejelasan
          proses buat setiap penyewa.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-road-100 p-5 transition-colors hover:border-road-200 hover:bg-road-50/50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-road-100 text-road-600">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-road-900">{title}</h3>
            <p className="mt-1 text-sm text-road-900/70">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};