export type Mobil = {
  id: string;
  nama: string;
  tipe: string;
  kapasitas: number;
  transmisi: string;
  bahan_bakar: string;
  harga_harian: number;
  gambar_url: string | null;
  tersedia: boolean;
  created_at: string;
};

export type Pengaturan = {
  id: number;
  no_hp_pemilik: string;
  bca_nomor: string;
  bca_atas_nama: string;
  mandiri_nomor: string;
  mandiri_atas_nama: string;
  updated_at: string;
};

export type Peminjam = {
  id: string;
  nama: string;
  no_hp: string;
  foto_ktp_url: string;
  tanggal_pinjam: string; // format ISO date, contoh: 2026-07-10
  tanggal_kembali: string | null;
  lokasi: string;
  mobil_id: string | null;
  mobil?: Pick<Mobil, "id" | "nama"> | null;
  status: "menunggu" | "dikonfirmasi" | "selesai" | "dibatalkan";
  catatan: string | null;
  created_at: string;
};