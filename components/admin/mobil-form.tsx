"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus } from "lucide-react";

export function MobilForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("mobil").insert({
      nama: formData.get("nama"),
      tipe: formData.get("tipe"),
      kapasitas: Number(formData.get("kapasitas")),
      transmisi: formData.get("transmisi"),
      bahan_bakar: formData.get("bahan_bakar"),
      harga_harian: Number(formData.get("harga_harian")),
      tersedia: true,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Tambah Mobil
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-road-100 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama Mobil</Label>
        <Input id="nama" name="nama" placeholder="Contoh: Toyota Calya" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tipe">Tipe</Label>
        <Input id="tipe" name="tipe" placeholder="Contoh: MPV 7-Seater" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="kapasitas">Kapasitas (orang)</Label>
        <Input id="kapasitas" name="kapasitas" type="number" defaultValue={5} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="transmisi">Transmisi</Label>
        <Input id="Transmisi" name="transmisi" placeholder="Manual/Matic" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bahan_bakar">Bahan Bakar</Label>
        <Input id="bahan_bakar" name="bahan_bakar" placeholder="Bensin" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="harga_harian">Harga per Hari (Rp)</Label>
        <Input id="harga_harian" name="harga_harian" type="number" required />
      </div>
      {error && (
        <p className="col-span-full rounded-md bg-red-50 px-3 py-2 text-sm text-road-600">
          {error}
        </p>
      )}
      <div className="col-span-full flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Menyimpan..." : "Simpan Mobil"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Batal
        </Button>
      </div>
    </form>
  );
}