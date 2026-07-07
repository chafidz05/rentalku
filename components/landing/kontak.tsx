import { FormSewa } from "@/components/landing/form-sewa";
import { createClient } from "@/lib/supabase/server";
import { Phone } from "lucide-react";

export async function Kontak() {
  const supabase = await createClient();
  const { data: mobil } = await supabase
    .from("mobil")
    .select("id, nama")
    .eq("tersedia", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: pengaturan } = await supabase
    .from("pengaturan")
    .select("no_hp_pemilik")
    .eq("id", 1)
    .maybeSingle();

  const noWhatsapp = pengaturan?.no_hp_pemilik ?? "6281234567890";

  return (
    <section id="kontak" className="bg-road-900 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="text-white">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Ajukan Sewa Mobil</h2>
          <p className="mt-2 max-w-md text-white/70">
            Isi form di samping, atau langsung hubungi kami lewat WhatsApp
            untuk tanya-tanya lebih dulu.
          </p>
          <a
            href={`https://wa.me/${noWhatsapp}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-road-900 transition-colors hover:bg-road-50"
          >
            <Phone className="h-4 w-4" />
            Chat via WhatsApp
          </a>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <FormSewa
            mobilId={mobil?.id ?? null}
            mobilNama={mobil?.nama ?? null}
            noWhatsappAdmin={noWhatsapp}
          />
        </div>
      </div>
    </section>
  );
};