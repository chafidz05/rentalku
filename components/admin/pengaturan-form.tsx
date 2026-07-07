"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { Pengaturan } from "@/types";

export function PengaturanForm({ data }: { data: Pengaturan }) {
  const [loading, setLoading] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null)
    setSukses(false);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("pengaturan")
      .update({
        no_hp_pemilik: formData.get("no_hp_pemilik"),
        bca_nomor: formData.get("bca_nomor"),
        bca_atas_nama: formData.get("bca_atas_nama"),
        mandiri_nomor: formData.get("mandiri_nomor"),
        mandiri_atas_nama: formData.get("mandiri_atas_nama"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSukses(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-6 rounded-xl border border-road-100 bg-white p-5 sm:p-6"
    >
      <div>
        <h2 className="font-display text-base font-bold text-road-900">
          Nomor WhatsApp Pemilik
        </h2>
        <p className="mt-1 text-sm text-road-900/60">
          Nomor ini dipakai untuk tombol &ldquo;Chat via WhatsApp&rdquo; di
          landing page. Format: kode negara tanpa &ldquo;+&rdquo;, contoh{" "}
          <code>628123456789</code>
        </p>
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="no_hp_pemilik">No. WhatsApp</Label>
          <Input
            id="no_hp_pemilik"
            name="no_hp_pemilik"
            defaultValue={data.no_hp_pemilik}
            placeholder="628123456789"
            required
          />
        </div>
      </div>
      <div className="border-t border-road-100 pt-5">
        <h2 className="font-display text-base font-bold text-road-900">
          Rekening BCA
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bca_nomor">Nomor Rekening</Label>
            <Input id="bca_nomor" name="bca_nomor" defaultValue={data.bca_nomor} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bca_atas_nama">Atas Nama</Label>
            <Input
              id="bca_atas_nama"
              name="bca_atas_nama"
              defaultValue={data.bca_atas_nama}
              required
            />
          </div>
        </div>
      </div>
      <div className="border-t border-road-100 pt-5">
        <h2 className="font-display text-base font-bold text-road-900">
          Rekening Mandiri
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="mandiri_nomor">Nomor Rekening</Label>
            <Input
              id="mandiri_nomor"
              name="mandiri_nomor"
              defaultValue={data.mandiri_nomor}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mandiri_atas_nama">Atas Nama</Label>
            <Input
              id="mandiri_atas_nama"
              name="mandiri_atas_nama"
              defaultValue={data.mandiri_atas_nama}
              required
            />
          </div>
        </div>
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {sukses && (
        <p className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Pengaturan berhasil disimpan. Landing page akan otomatis terupdate.
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </form>
  );
}