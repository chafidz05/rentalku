-- =====================================================================
-- SCHEMA SUPABASE — RentalKu
-- Aman dijalankan ulang (idempotent), termasuk di project yang sudah
-- pernah menjalankan versi schema sebelumnya.
-- Jalankan di: Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================

-- 1. TABEL MOBIL (dibuat lebih dulu karena direferensikan oleh peminjam)
create table if not exists mobil (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tipe text not null,
  kapasitas int not null default 5,
  transmisi text not null default 'Manual',
  bahan_bakar text not null default 'Bensin',
  harga_harian numeric not null,
  gambar_url text,
  tersedia boolean not null default true,
  created_at timestamptz not null default now()
);

alter table mobil enable row level security;

drop policy if exists "Publik dapat melihat mobil" on mobil;
create policy "Publik dapat melihat mobil"
  on mobil for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin dapat menambah mobil" on mobil;
create policy "Admin dapat menambah mobil"
  on mobil for insert
  to authenticated
  with check (true);

drop policy if exists "Admin dapat mengubah mobil" on mobil;
create policy "Admin dapat mengubah mobil"
  on mobil for update
  to authenticated
  using (true);

-- Data awal: 1 unit Toyota Calya (hanya masuk jika tabel mobil masih kosong)
insert into mobil (nama, tipe, kapasitas, transmisi, bahan_bakar, harga_harian, tersedia)
select 'Toyota Calya', 'MPV 7-Seater', 7, 'Manual/Matic', 'Bensin', 350000, true
where not exists (select 1 from mobil);


-- 2. TABEL PEMINJAM
create table if not exists peminjam (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  no_hp text not null default '-',
  foto_ktp_url text not null,
  tanggal_pinjam date not null,
  tanggal_kembali date,
  lokasi text not null,
  mobil_id uuid references mobil (id),
  status text not null default 'menunggu' check (status in ('menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan')),
  catatan text,
  created_at timestamptz not null default now()
);

-- Jika tabel peminjam sudah ada dari versi schema lama, tambahkan kolom baru
alter table peminjam add column if not exists no_hp text not null default '-';
alter table peminjam add column if not exists mobil_id uuid references mobil (id);
alter table peminjam drop column if exists mobil; -- kolom teks lama, diganti relasi mobil_id

alter table peminjam enable row level security;

drop policy if exists "Publik dapat mengirim pengajuan sewa" on peminjam;
create policy "Publik dapat mengirim pengajuan sewa"
  on peminjam for insert
  to anon
  with check (true);

drop policy if exists "Admin dapat membaca semua pengajuan" on peminjam;
create policy "Admin dapat membaca semua pengajuan"
  on peminjam for select
  to authenticated
  using (true);

drop policy if exists "Admin dapat mengubah status pengajuan" on peminjam;
create policy "Admin dapat mengubah status pengajuan"
  on peminjam for update
  to authenticated
  using (true);


-- 3. STORAGE BUCKET UNTUK FOTO KTP
insert into storage.buckets (id, name, public)
values ('foto-ktp', 'foto-ktp', true)
on conflict (id) do nothing;

drop policy if exists "Publik dapat mengunggah foto KTP" on storage.objects;
create policy "Publik dapat mengunggah foto KTP"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'foto-ktp');

drop policy if exists "Semua orang dapat melihat foto KTP" on storage.objects;
create policy "Semua orang dapat melihat foto KTP"
  on storage.objects for select
  to public
  using (bucket_id = 'foto-ktp');

-- Catatan: foto KTP bersifat data pribadi sensitif. Untuk keamanan lebih
-- baik sebelum go-live: ubah bucket ini menjadi private lalu gunakan
-- signed URL saat menampilkan foto di halaman admin.


-- 4. CATATAN AKUN ADMIN
-- Project ini memakai Supabase Auth (auth.users) langsung sebagai akun
-- admin, bukan tabel kustom. Buat akun lewat:
-- Authentication > Users > Add user (di Supabase Dashboard).
-- Semua kebijakan "to authenticated" di atas otomatis berlaku untuk
-- akun yang dibuat di sana — tidak perlu setup tambahan.
