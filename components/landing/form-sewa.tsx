"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, Phone } from "lucide-react";

const DEFAULT_NO_WA_ADMIN = "6281234567890";

export function FormSewa({
  mobilId,
  mobilNama,
  noWhatsappAdmin,
}: {
  mobilId?: string | null,
  mobilNama?: string | null,
  noWhatsappAdmin?: string | null,
}) {
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noWaAdmin = noWhatsappAdmin || DEFAULT_NO_WA_ADMIN;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nama = formData.get("nama") as string;
    const no_hp = formData.get("no_hp") as string;
    const tanggal_pinjam = formData.get("tanggal_pinjam") as string;
    const lokasi = formData.get("lokasi") as string;
    const fotoKtp = formData.get("foto_ktp") as File;

    try {
      const supabase = createClient();

      let foto_ktp_url = "";
      if (fotoKtp && fotoKtp.size > 0) {
        const namaFile = `${Date.now()}-${fotoKtp.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("foto-ktp")
          .upload(namaFile, fotoKtp);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("foto-ktp")
          .getPublicUrl(uploadData.path);
        foto_ktp_url = publicUrl.publicUrl;
      }

      const { error: insertError } = await supabase.from("peminjam").insert({
        nama,
        no_hp,
        tanggal_pinjam,
        lokasi,
        foto_ktp_url,
        mobil_id: mobilId ?? null,
        status: "menunggu",
      });

      if (insertError) throw insertError;

      fetch("/api/notifikasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          no_hp,
          tanggal_pinjam,
          lokasi,
          mobil_nama: mobilNama ?? null,
        }),
      }).catch((err) => console.error("Notifikasi gagal terkirim:", err));

      setSukses(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan, silahkan coba lagi."
      );
    } finally {
      setLoading(false);
    };
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" name="nama" placeholder="Sesuai KTP" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="no_hp">Nomor HP / WhatsApp</Label>
          <Input
            id="no_hp"
            name="no_hp"
            type="tel"
            inputMode="numeric"
            placeholder="08xxxxxxxxxxx"
            pattern="[0-9+ ]{9,15}"
            title="Masukkan nomor HP yang valid"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="foto_ktp">Foto KTP</Label>
          <Input id="foto_ktp" name="foto_ktp" type="file" accept="image/*" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tanggal_pinjam">Tanggal Pinjam</Label>
            <Input id="tanggal_pinjam" name="tanggal_pinjam" type="date" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lokasi">Lokasi Tujuan</Label>
            <Input id="lokasi" name="lokasi" placeholder="Contoh: Bandung" required />
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Mengirim..." : "Kirim Pengajuan"}
        </Button>
      </form>

      <Dialog open={sukses} onOpenChange={setSukses}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-3 pt-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </span>
            <DialogTitle className="text-xl">
              Pengajuan Berhasil Terkirim!
            </DialogTitle>
            <p className="text-sm text-road-900/70">
              Terima kasih, pengajuan sewa kamu sudah kami terima. Admin
              akan menghubungi dan mengonfirmasi pesanan kamu melalui
              WhatsApp berikut:
            </p>
            <div className="w-full rounded-xl border border-road-100 bg-road-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-road-900/50">
                No. Whatsapp Admin
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-road-900">
                +{noWaAdmin}
              </p>
            </div>
            <div className="mt-1 flex w-full flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full">
                <a
                  href={`https://wa.me/${noWaAdmin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  Chat Admin Sekarang
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSukses(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};