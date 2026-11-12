# PartnerSeek

> **Seek Your Partner and Catch the Peak!**
> Platform pencarian partner berbasis keahlian untuk mahasiswa: lomba, PKM, proyek, freelance, dan startup.

Proyek Kelompok 4, Sistem Informasi UNNES.

## Fitur

| Area | Isi |
| --- | --- |
| **Landing page** | Hero animasi, masalah → solusi, cara kerja, fitur, talent spotlight (data dari DB), tabel pembeda vs WA/IG/LinkedIn, CTA UMKM, FAQ, form daftar tunggu |
| **Auth** | Daftar / masuk (mahasiswa, UMKM/startup, organisasi), sesi JWT httpOnly cookie, password di-hash bcrypt |
| **Cari talenta** | Filter multi-skill (harus punya semua), prodi, kampus, minat, urutan, paginasi |
| **Profil** | Skill + level, endorsement, portofolio, riwayat/prestasi, tombol WhatsApp, lencana verifikasi |
| **Cari partner (feed)** | Postingan kebutuhan tim, filter jenis, rekomendasi "Cocok untukmu", persentase kecocokan talenta |
| **Chat** | Percakapan antar-pengguna, penanda belum dibaca, pintasan ke WhatsApp |
| **Tantangan** | UMKM/organisasi membuka tantangan, mahasiswa mengikuti (talent scouting) |
| **Dasbor** | Statistik, kelengkapan profil, kebutuhan saya |
| **Tracking** | GTM, GA4, Meta Pixel, tangkap UTM, event `klik_daftar`, `form_submitted`, `sign_up`, `waitlist_signup` |

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (tema warna dari logo: navy `#002868`, amber `#F8A818`)
- MySQL + Knex (migrasi & seed), driver `mysql2`
- `jose` (JWT), `bcryptjs`, `zod`, `lucide-react`
- Font: Fredoka (judul) + Plus Jakarta Sans (isi)

## Menjalankan di lokal

Prasyarat: Node.js 20+ dan MySQL (mis. lewat MySQL Workbench).

```bash
# 1. pasang dependensi
npm install

# 2. buat database kosong lewat MySQL Workbench / CLI
#    CREATE DATABASE partnerseek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. salin env lalu isi kredensial MySQL kamu
cp .env.example .env.local        # Windows: copy .env.example .env.local

# 4. buat tabel + isi data dummy
npm run db:migrate
npm run db:seed

# 5. jalankan
npm run dev                       # http://localhost:3000
```

Perintah database lain: `npm run db:rollback` (batalkan batch terakhir) dan `npm run db:reset` (hapus semua → migrate → seed).

### Akun demo

Semua akun dummy memakai password **`partnerseek123`**.

| Peran | Email |
| --- | --- |
| Mahasiswa (UI/UX) | `rina.kusuma@example.com` |
| Mahasiswa (Fullstack) | `dimas.prakoso@example.com` |
| Mahasiswa (Data) | `nadia.rahma@example.com` |
| UMKM | `kopi.kelana@example.com` |
| Startup | `ngajar.in@example.com` |
| Organisasi | `hima.si.unnes@example.com` |

> Semua nama, karya, dan postingan di seed adalah **data fiktif** untuk demo.

## Deploy ke Vercel

1. Push repo ke GitHub, lalu **Import** project di Vercel (framework terdeteksi otomatis sebagai Next.js).
2. **Database harus online.** Vercel tidak bisa mengakses MySQL di laptopmu. Pakai database yang kompatibel MySQL di cloud, mis. **TiDB Cloud Starter** (panduan di bawah), Aiven, atau Railway. Jalankan migrasi dari laptop dengan kredensial database cloud di `.env.local`.
3. Di **Vercel → Settings → Environment Variables** isi semua variabel pada `.env.example`:
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, dan (jika sudah ada) `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.
   Buat `AUTH_SECRET` dengan `openssl rand -base64 48`.
4. Deploy. Setelah punya domain, ubah `NEXT_PUBLIC_SITE_URL` ke domain tersebut.

> Pool koneksi sengaja kecil (maks 5) agar aman untuk serverless. Jika penyedia MySQL membatasi koneksi, pertimbangkan connection pooler.

## Setup database di TiDB Cloud

TiDB kompatibel dengan MySQL, jadi kode (Knex + `mysql2`) tidak perlu diubah, cukup ganti env.

1. Daftar di [tidbcloud.com](https://tidbcloud.com), lalu buat instance **TiDB Cloud Starter** (pilih region terdekat).
2. Buka **My TiDB → instance → Connect**. Pilih *Connection Type: Public*, *Branch: main*, *Connect With: General*, lalu **Generate Password** dan simpan.
3. Buat database lewat SQL Editor di konsol TiDB Cloud (atau MySQL Workbench dengan SSL aktif):
   ```sql
   CREATE DATABASE partnerseek CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Isi `.env.local` dengan parameter dari dialog Connect:
   ```env
   DB_HOST=<host dari dialog, mis. gateway01.<region>.prod.aws.tidbcloud.com>
   DB_PORT=4000
   DB_USER=<prefix>.root
   DB_PASSWORD=<password yang di-generate>
   DB_NAME=partnerseek
   DB_SSL=true
   DB_POOL_MAX=1
   ```
5. Buat tabel: `npm run db:migrate`.
6. (Opsional, hanya untuk demo) isi data dummy: `npm run db:seed`.
   > **Awas:** `db:seed` dan `db:reset` mengosongkan semua tabel. Jangan dijalankan pada database yang sudah berisi data asli.
7. Di Vercel, isi variabel yang sama (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true`, `DB_POOL_MAX=1`) ditambah `AUTH_SECRET` dan `NEXT_PUBLIC_SITE_URL`, lalu redeploy.

Masalah umum: `Access denied` biasanya karena `DB_USER` lupa memakai prefix (`xxxx.root`); error SSL berarti `DB_SSL` belum `true`; `Too many connections` berarti `DB_POOL_MAX` perlu diturunkan ke 1.

## Tracking (GA4, GTM, Meta Pixel)

Kosongkan variabel yang belum ada, kodenya otomatis tidak memasang script tersebut.

- **GTM** (`NEXT_PUBLIC_GTM_ID`): event dikirim ke `dataLayer`.
- **GA4** (`NEXT_PUBLIC_GA_ID`): jika GA4 sudah dipasang lewat GTM, kosongkan variabel ini agar tidak terhitung ganda.
- **Meta Pixel** (`NEXT_PUBLIC_META_PIXEL_ID`): `sign_up` → `CompleteRegistration`, `waitlist_signup` → `Lead`, `klik_daftar` → `InitiateCheckout`; event lain dikirim sebagai custom event.
- **UTM**: parameter `utm_source`, `utm_medium`, `utm_campaign` pada URL disimpan di cookie 30 hari, dikirim bersama setiap event, dan tersimpan di tabel `users` dan `waitlist`. Contoh tautan iklan:
  `https://domainmu.com/?utm_source=instagram&utm_medium=paid&utm_campaign=minggu1_uji_materi`

Event yang dikirim: `klik_daftar` (tombol daftar), `form_submitted` (waitlist, daftar, buat kebutuhan, ikut tantangan), `sign_up`, `waitlist_signup`, `view_talent`, `send_message`, `klik_tantangan`.

## Struktur

```
db/migrations   skema database (Knex)
db/seeds        data dummy
scripts/db.ts   runner migrate/seed lintas OS
src/app         halaman (App Router) + proxy.ts untuk proteksi rute
src/components  komponen UI
src/lib         db, auth, data (query), actions (server actions), tracking
```

## Catatan keamanan

- Password di-hash (bcrypt), sesi memakai cookie `httpOnly` + `SameSite=Lax` (`Secure` di produksi).
- Semua query lewat Knex (parameterized), input divalidasi dengan zod, dan pengalihan `next` dicek agar tidak jadi open redirect.
- Pengecekan otorisasi dilakukan di server (`requireUser`); `proxy.ts` hanya lapisan cek awal.
- Jangan commit `.env.local`. Sudah masuk `.gitignore`.
