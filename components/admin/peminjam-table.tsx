"use client";

import { useMemo, useState } from "react";
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { createClient } from "@/lib/supabase/client";
import { formatTanggal } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewNama, setPreviewNama] = useState<string>("");
  const [hapusTarget, setHapusTarget] = useState<Peminjam | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.max(Math.ceil(items.length / pageSize), 1);
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  async function ubahStatus(id: string, status: Peminjam["status"]) {
    const supabase = createClient();
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    await supabase.from("peminjam").update({ status }).eq("id", id);
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("peminjam")
      .delete()
      .eq("id", hapusTarget.id);

    setDeleting(false);

    if (error) {
      alert(`Gagal menghapus: ${error.message}`);
    };

    setItems((prev) => {
      const next = prev.filter((item) => item.id !== hapusTarget.id);
      const newTotalPages = Math.max(Math.ceil(next.length / pageSize), 1);
      if (page > newTotalPages) setPage(newTotalPages);
      return next;
    });

    setHapusTarget(null);
  }

  function bukaPreview(url: string, nama: string) {
    setPreviewUrl(url);
    setPreviewNama(nama);
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
    <>
      <Dialog
        open={previewUrl !== null}
        onOpenChange={(open) => !open && setPreviewUrl(null)}
      >
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
                      <button
                        type="button"
                        onClick={() => bukaPreview(item.foto_ktp_url, item.nama)}
                        className="block rounded-md ring-road-600 transition hover:opacity-80 focus:outline-none focus-visible:ring-2"
                      >
                        <Image
                          src={item.foto_ktp_url}
                          alt={`KTP ${item.nama}`}
                          width={56}
                          height={56}
                          className="rounded-md border border-road-100 object-cover"
                        />
                      </button>
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-road-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setHapusTarget(item)}
                        aria-label={`Hapus pengajuan ${item.nama}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={items.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Foto KTP - {previewNama}</DialogTitle>
          {previewUrl && (
            <div className="mt-3 max-h-[75vh] w-full overflow-auto rounded-lg bg-road-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`KTP ${previewNama}`}
                className="mx-auto h-auto max-w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={hapusTarget !== null}
        onOpenChange={(open) => !open && setHapusTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengajuan sewa?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan dari <strong>{hapusTarget?.nama}</strong> akan dihapus
              permanen dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                konfirmasiHapus();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};