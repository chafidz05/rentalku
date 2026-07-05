"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Check, Pencil } from "lucide-react";
import type { Mobil } from "@/types";

export function MobilTable({ data }: { data: Mobil[] }) {
  const [items, setItems] = useState(data);
  const [editId, setEditId] = useState<string | null>(null);
  const [hargaEdit, setHargaEdit] = useState("");
  const [saving, setSaving] = useState(false);

  async function toggleTersedia(id: string, tersedia: boolean) {
    const supabase = createClient();
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, tersedia } : m));
    await supabase.from("mobil").update({ tersedia }).eq("id", id);
  }

  function mulaiEdit(mobil: Mobil) {
    setEditId(mobil.id);
    setHargaEdit(String(mobil.harga_harian));
  }

  async function simpanHarga(id: string) {
    const harga = Number(hargaEdit);
    if (!harga || harga <= 0) return;

    setSaving(true);
    const supabase = createClient();
    await supabase.from("mobil").update({ harga_harian: harga }).eq("id", id);
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, harga_harian: harga } : m)));
    setSaving(false);
    setEditId(null);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-road-200 p-10 text-center">
        <p className="font-display font-bold text-road-900">Belum ada mobil</p>
        <p className="mt-1 text-sm text-road-900/60">
          Tambahkan unit mobil pertama lewat form diatas.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-road-200 p-10 text-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Harga/Hari</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((mobil) => (
            <TableRow key={mobil.id}>
              <TableCell className="font-medium">{mobil.nama}</TableCell>
              <TableCell>{mobil.tipe}</TableCell>
              <TableCell>{mobil.kapasitas} orang</TableCell>
              <TableCell>
                {editId === mobil.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={hargaEdit}
                      onChange={(e) => setHargaEdit(e.target.value)}
                      type="number"
                      className="h-9 w-28"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9"
                      onClick={() => simpanHarga(mobil.id)}
                      disabled={saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => mulaiEdit(mobil)}
                    className="flex items-center gap-1.5 text-road-900 hover:text-road-600"
                  >
                    Rp{mobil.harga_harian.toLocaleString("id-ID")}
                    <Pencil className="h-3.5 w-3.5 text-road-900/40" />
                  </button>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={mobil.tersedia ? "success" : "secondary"}>
                  {mobil.tersedia ? "Tersedia" : "Tidak tersedia"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleTersedia(mobil.id, !mobil.tersedia)}
                >
                  {mobil.tersedia ? "Tandai Tidak Tersedia" : "Tandai Tersedia"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}