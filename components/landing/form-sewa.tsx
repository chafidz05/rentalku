"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export function FormSewa({
  mobilId,
  mobilNama,
}: {
  mobilId?: string | null,
  mobilNama?: string | null
}) {
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      e.currentTarget.reset();
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

  if (sukses) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-road-100 bg-road-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-road-600" />
        <p className="font-display text-lg font-bold text-road-900">
          Pengajuan terkirim!
        </p>
        <p className="text-sm text-road-900/70">
          Tim kami akan menghubungi kamu lewat WhatsApp untuk konfirmasi.
        </p>
        <Button variant="outline" onClick={() => setSukses(false)}>
          Ajukan Lagi
        </Button>
      </div>
    );
  };

  return (
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
          <Label htmlFor="lokasi">Lokasi Jemput</Label>
          <Input id="lokasi" name="lokasi" placeholder="Contoh: Bandung Kota" required />
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
  );
};