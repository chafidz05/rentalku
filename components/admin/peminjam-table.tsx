"use client";

import { useState } from "react";
import Image from "next/image";
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
import { createClient } from "@/lib/supabase/client";
import { formatTanggal } from "@/lib/utils";
import type { Peminjam } from "@/types";

const statusVariant: Record<
  Peminjam["status"],
  "default" | "secondary" | "success" | "warning"
> = {
  menunggu: "warning",
  dikonfirmasi: "default",
  selesai: "success",
  dibatalkan: "secondary",
};

export function PeminjamTable({ data }: { data: Peminjam[] }) {
  const [items, setItems] = useState(data);

  async function ubahStatus(id: string, status: Peminjam["status"]) {
    const supabase = createClient();
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    await supabase.from("peminjam").update({ status }).eq("id", id);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-road-200 p-10 text-center">
        <p className="font-display font-bold text-road-900">Belum ada pengajuan</p>
        <p className="mt-1 text-sm text-road-900/60">
          Pengajuan sewa dari pelanggan akan muncul di sini.
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-road-100 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto KTP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>No. HP</TableHead>
            <TableHead>Mobil</TableHead>
            <TableHead>Tanggal Pinjam</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.foto_ktp_url ? (
                  <a href={item.foto_ktp_url} target="_blank" rel="noreferrer">
                    <Image
                      src={item.foto_ktp_url}
                      alt={"KTP ${item.nama}"}
                      width={56}
                      height={56}
                      className="rounded-md border border-road-100 object-cover"
                    />
                  </a>
                ) : (
                  <span className="text-xs text-road-900/40">-</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.nama}</TableCell>
              <TableCell>
                <a
                  href={`https://wa.me/${item.no_hp.replace(/^0/, "62").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-road-600 hover:underline"
                >
                  {item.no_hp}
                </a>
              </TableCell>
              <TableCell>{item.mobil?.nama ?? "-"}</TableCell>
              <TableCell>{formatTanggal(item.tanggal_pinjam)}</TableCell>
              <TableCell>{item.lokasi}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {item.status !== "dikonfirmasi" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => ubahStatus(item.id, "dikonfirmasi")}
                    >
                      Konfirmasi
                    </Button>
                  )}
                  {item.status !== "selesai" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => ubahStatus(item.id, "selesai")}
                    >
                      Selesai
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};