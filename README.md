# Backend Database

Ini adalah repositori backend berbasis Express.js yang menyediakan API untuk sistem manajemen database produk dan user.

## Struktur Project

Berikut adalah penjelasan mengenai struktur folder yang ada di dalam direktori `./src`:

- **`src/Assets`**: Menyimpan file statis seperti gambar atau file publik lainnya yang dapat diakses secara langsung.
- **`src/Config`**: Berisi konfigurasi aplikasi, khususnya koneksi ke database (misalnya menggunakan Sequelize).
- **`src/Controllers`**: Berisi logika bisnis (business logic) aplikasi. Setiap fungsi di sini menangani request dari route dan mengembalikan response yang sesuai.
- **`src/Libs`**: Direktori untuk fungsi bantuan (helper functions) dan library tambahan, seperti manajemen autentikasi, fungsi utilitas umum, dan lain-lain.
- **`src/Middlewares`**: Berisi fungsi middleware Express yang dijalankan sebelum request mencapai controller. Contohnya: validasi autentikasi (`authenticated`), otorisasi role (`authorizeRole`), logging, dan penanganan error.
- **`src/Models`**: Mendefinisikan struktur data atau skema database (menggunakan Sequelize Model). File-file di sini merepresentasikan tabel-tabel di database.
- **`src/Routes`**: Menentukan endpoint API dan menghubungkannya dengan controller yang sesuai. Ini adalah pintu masuk untuk setiap request yang datang ke server.
- **`src/Seeders`**: Berisi skrip untuk mengisi database dengan data awal (dummy data) untuk keperluan development atau testing.

## Persiapan Awal

Sebelum menjalankan aplikasi (`npm run dev` atau `npm start`), ada beberapa langkah konfigurasi yang harus dilakukan agar aplikasi berjalan dengan lancar.

### 1. Konfigurasi Environment Variable (.env)

Agar aplikasi dapat berjalan, kita perlu mengatur variabel lingkungan (environment variables).

- **Rename file configurasi**: Ubah nama file `.env.sample` menjadi `.env`.
- **Mode Development**: Buka file `.env` dan ubah `NODE_ENV` menjadi `development`.
  ```env
  NODE_ENV=development
  ```
- **URL Frontend**: Sesuaikan `ALLOWED_ORIGIN` dengan URL frontend yang akan mengakses API ini (misalnya `http://localhost:5173`).
  ```env
  ALLOWED_ORIGIN="http://localhost:5173"
  ```
- **Keamanan (Security)**: Pada bagian `# Security`, ganti nilai `...` dengan string acak (random) sepanjang 32 karakter (kombinsi huruf dan angka) untuk menjaga keamanan token.
  ```env
  JWT_SECRET="kombinasi_acak_32_karakter_di_sini"
  ACCESS_TOKEN_SECRET="kombinasi_acak_32_karakter_di_sini"
  REFRESH_TOKEN_SECRET="kombinasi_acak_32_karakter_di_sini"
  ENCRYPTION_KEY="kombinasi_acak_32_karakter_di_sini"
  ```

### 2. Konfigurasi Database

- **Buat Database**: Buat database baru di MySQL dengan nama `e-commerce_dev`.
- **Sinkronisasi Database**: Jalankan perintah berikut untuk mensinkronkan struktur tabel ke database:
  ```bash
  node sync-db
  ```
- **Isi Data Awal (Seeding)**: Jalankan perintah berikut satu per satu untuk mengisi data awal (dummy data) agar aplikasi tidak kosong:
  ```bash
  node ./src/Seeders/unifiedProductSeeder.js
  ```

### 3. Konfigurasi Email (SMTP)

Untuk fitur pengiriman email (seperti verifikasi akun), kita menggunakan Gmail SMTP.

- **App Password**: Buat "App Password" di akun Google Anda (karena login password biasa tidak aman untuk aplikasi pihak ketiga).
- **Setup SMTP**: Di file `.env`, update konfigurasi SMTP:
  ```env
  SMTP_USER="emailvalidkamu@gmail.com"
  SMTP_PASS="password_app_google_anda"
  ```
- **Domain yang Diizinkan (Opsional)**: Anda bisa membatasi domain email yang boleh mendaftar. Defaultnya `gmail.com`. Jika ingin menambah domain lain (misalnya email kampus), tambahkan dengan pemisah koma:
  ```env
  ALLOWED_DOMAIN_MAIL="gmail.com, mhs.stmik-tegal.ac.id"
  ```

## Cara Menjalankan

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Jalankan server (Development):**

    ```bash
    npm run dev
    ```

3.  **Jalankan server (Production):**
    ```bash
    npm start
    ```

## Lisensi

[ISC](LICENSE)
