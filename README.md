# Catatan

Catatan adalah aplikasi web untuk membantu pengurus lembaga pesantren menyimpan dan mengakses peraturan, wirid, serta informasi kegiatan. Pergantian pengurus setiap tahun dapat membuat dokumen lama sulit ditemukan, apalagi jika harus membuka berkas Word yang panjang. Dengan mengelompokkan catatan berdasarkan dashboard dan menyediakan pencarian, pengurus dapat menemukan informasi yang dibutuhkan dengan lebih mudah.

## Fitur

- **Peraturan** — melihat, mencari, menambah, mengubah, dan menghapus catatan peraturan.
- **Tugas Utama, Tugas Harian, dan Acara** — mengelola catatan sesuai kelompoknya.
- **Doa/Wirid** — menyimpan catatan dengan lampiran PDF; lampiran dapat dibuka dari daftar.
- **Pencarian** — mencari catatan berdasarkan judul.
- **Unduh catatan** — mengunduh catatan yang sedang ditampilkan sebagai dokumen Word (`.docx`).
- **Admin** — masuk ke dashboard admin untuk mengelola kredensial catatan.
- **Informasi** — melihat video panduan penggunaan website.

Untuk tindakan tambah, ubah, dan hapus catatan, aplikasi meminta username dan password yang terkait dengan catatan tersebut. Fitur admin menggunakan akun admin.

## Teknologi

- Frontend: React, Vite, Tailwind CSS, dan React Router.
- Backend: Node.js dan Express.
- Database: PostgreSQL.
- Penyimpanan lampiran PDF: Supabase Storage.

## Struktur proyek

```text
.
├── backend/   # API, koneksi database, dan migrasi
├── client/    # Aplikasi web React
└── README.md
```

## Menjalankan secara lokal

### Prasyarat

- Node.js dan npm.
- PostgreSQL yang dapat diakses dari komputer pengembangan.
- Proyek Supabase dengan bucket Storage bernama `catatan`.

### 1. Siapkan backend

Buat database PostgreSQL, lalu buat file `backend/.env` dengan konfigurasi berikut:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/NAMA_DATABASE
NODE_ENV=production
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY
JWT_SECRET=GANTI_DENGAN_SECRET_YANG_KUAT
```

Ganti nilai contoh dengan konfigurasi milik Anda. Jaga `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, dan kredensial database agar tetap rahasia. Jangan commit file `.env` atau membagikan nilai rahasia.

Pasang dependensi, jalankan migrasi untuk membuat tabel, lalu mulai server:

```bash
cd backend
npm install
npm run migrate:up
npm run dev
```

Server lokal berjalan di `http://localhost:5000`; API tersedia di `http://localhost:5000/api`.

### 2. Siapkan frontend

Secara default, frontend menggunakan API lokal di `http://localhost:5000/api`. Jika alamat API berbeda, buat file `client/.env` dan sesuaikan nilainya:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Di terminal lain, pasang dependensi dan jalankan aplikasi:

```bash
cd client
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal (umumnya `http://localhost:5173`).

## Perintah yang tersedia

Jalankan perintah berikut dari direktori terkait:

| Direktori | Perintah               | Kegunaan                                    |
| --------- | ---------------------- | ------------------------------------------- |
| `client`  | `npm run dev`          | Menjalankan server pengembangan frontend    |
| `client`  | `npm run build`        | Membuat build frontend                      |
| `client`  | `npm run lint`         | Menjalankan ESLint                          |
| `client`  | `npm run preview`      | Meninjau build frontend secara lokal        |
| `backend` | `npm run dev`          | Menjalankan backend dalam mode pengembangan |
| `backend` | `npm start`            | Menjalankan backend                         |
| `backend` | `npm run migrate:up`   | Membuat tabel database                      |
| `backend` | `npm run migrate:down` | Menghapus tabel aplikasi                    |

> **Perhatian:** `npm run migrate:down` menghapus tabel aplikasi beserta datanya. Gunakan hanya jika memang ingin menghapus data tersebut.
