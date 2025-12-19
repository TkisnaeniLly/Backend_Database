# 📘 CONTRIBUTING.md – Panduan Kontribusi Proyek Basis Data 2

Panduan ini disusun untuk membantu seluruh anggota tim dalam berkontribusi pada proyek **Aplikasi E-Commerce** mata kuliah **Basis Data 2** secara rapi, terstruktur, dan konsisten.

---

## 🧱 1. Bentuk Kontribusi

Kontribusi yang diperbolehkan dalam proyek ini meliputi:

- ✨ Penambahan fitur baru (modul, tabel, query, atau endpoint)
- 🐞 Perbaikan bug atau error
- 🧹 Perapihan dan optimasi struktur kode
- 📚 Perbaikan atau penambahan dokumentasi
- 🚀 Peningkatan performa aplikasi atau query database
- 🧪 Dokumentasi dan laporan hasil pengujian

Semua kontribusi **wajib relevan** dengan pengembangan aplikasi e-commerce.

---

## 🛠 2. Persiapan Lingkungan Pengembangan

### 2.0 Konfigurasi Kredensial Git (WAJIB)

Sebelum mulai bekerja, setiap anggota **WAJIB mengatur identitas Git** agar setiap commit dapat dikenali.

```bash
git config --global user.name "username"
git config --global user.email "email@domain.com"
```

Cek konfigurasi:

```bash
git config --global --list
```

> ⚠️ Pastikan email sesuai dengan email GitHub yang digunakan.

---

### 2.1 Konfigurasi Akses GitHub (HTTPS / SSH)

Setiap anggota dapat memilih salah satu metode akses repository berikut.

#### Opsi A: Menggunakan HTTPS (paling mudah untuk pemula)

- Tidak memerlukan konfigurasi tambahan
- Saat push pertama kali, GitHub akan meminta **username** dan **token**

Direkomendasikan untuk anggota yang **belum terbiasa dengan SSH**.

---

#### Opsi B: Menggunakan SSH (disarankan)

Metode ini lebih stabil dan tidak perlu login berulang.

##### 1. Membuat SSH key (jika belum ada)

```bash
ssh-keygen -t ed25519 -C "email@domain.com"
```

Tekan **Enter** sampai selesai.

##### 2. Menambahkan SSH key ke GitHub

Salin isi public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

- Buka GitHub → **Settings** → **SSH and GPG Keys**
- Klik **New SSH Key**
- Paste key dan simpan

##### 3. Mengaktifkan SSH Agent (wajib setiap login baru)

Untuk mempermudah, digunakan script helper berikut:

```bash
connectSshGithub
```

Script ini akan:

- Menjalankan `ssh-agent`
- Menambahkan SSH key
- Mengetes koneksi ke GitHub

Jika muncul pesan sukses dari GitHub, berarti SSH siap digunakan.

---

### 2.1 Pembagian Tahapan Pengembangan oleh PM

Untuk memastikan pengembangan aplikasi berjalan terstruktur dan sesuai target, **Project Manager (PM)** membagi proses pengembangan ke dalam **3 tahapan utama** berikut:

---

### 🔹 Tahap 1: Normalisasi & Analisis Tabel

Tahap ini **WAJIB dilakukan oleh seluruh anggota tim secara individu**.

#### Langkah-langkah Tahap 1:

1. Pastikan berada di branch `main`

```bash
git checkout main
git pull origin main
```

2. Buat branch pribadi sesuai **Nama dan NIM**

```bash
git checkout -b <nama>_<NIM>
```

Contoh:

```bash
git checkout -b khilmyfr_24225029
```

3. Buat file Markdown untuk analisis normalisasi

Pembuatan file bersifat **opsional menggunakan CLI**.

Anda dapat memilih salah satu cara berikut:

**Opsi A (melalui VS Code – disarankan untuk pengguna Windows):**

1. Buka folder proyek menggunakan **VS Code**
2. Klik kanan pada folder proyek
3. Pilih **New File**
4. Beri nama: `normalisasi.md`

**Opsi B (melalui Git Bash / CLI):**

```bash
touch normalisasi.md
```

4. Isi file `normalisasi.md` dengan:

   - Daftar tabel awal
   - Hasil normalisasi (1NF, 2NF, 3NF)
   - Penjelasan apakah tabel:

     - Layak dijadikan tabel database, atau
     - Hanya proses/logika aplikasi

   - Alasan teknis dan fungsional

5. Simpan perubahan, lalu cek status

```bash
git status
```

6. Tambahkan file ke staging

```bash
git add normalisasi.md
```

7. Lakukan commit

```bash
git commit -m "docs: analisis normalisasi tabel"
```

8. Push ke repository

```bash
git push origin <nama>_<NIM>
```

---

### 🔹 Tahap 2: Pembagian & Implementasi Tugas

Tahap ini dilakukan **setelah Tahap 1 selesai dan dievaluasi oleh PM**.

#### Langkah-langkah Tahap 2:

1. Pindah ke branch `main` dan ambil update terbaru

```bash
git checkout main
git pull origin main
```

2. Checkout ke branch yang **telah ditentukan oleh PM**

```bash
git checkout nama-branch
```

Contoh:

```bash
git checkout feature/backend-transaksi
```

3. Kerjakan tugas sesuai peran:

   - UI: desain tampilan
   - Frontend: implementasi tampilan
   - Backend: API, query, logic
   - UX: alur pengguna
   - Testing: pengujian & laporan bug

4. Cek perubahan

```bash
git status
```

5. Tambahkan file yang berubah

```bash
git add .
```

6. Commit perubahan

```bash
git commit -m "feat: implementasi modul sesuai peran"
```

7. Push ke branch tugas

```bash
git push origin nama-branch
```

---

### 🔹 Tahap 3: Finalisasi Proyek

Tahap akhir difokuskan pada:

- Integrasi seluruh modul (database, backend, frontend)
- Perbaikan bug akhir
- Penyempurnaan dokumentasi
- Testing menyeluruh aplikasi

Pada tahap ini:

- Tidak diperkenankan menambah fitur besar baru
- Fokus pada **stabilitas dan kesiapan presentasi**

---

### 2.2 Clone Repository

Langkah-langkah berikut **WAJIB diikuti secara berurutan**, khususnya bagi anggota yang **baru pertama kali menggunakan Git Bash**.

1. Buka **Git Bash**
2. Tentukan folder kerja (contoh: Documents/Github)

```bash
cd ~/Documents
mkdir Github
cd Github
```

3. Clone repository proyek menggunakan **HTTPS**

```bash
git clone https://github.com/TkisnaeniLly/DATABASE-TEKNIK-INFORMATIKA-3A.git
```

Atau menggunakan **SSH** (disarankan jika sudah setup SSH key):

```bash
git clone git@github.com:TkisnaeniLly/DATABASE-TEKNIK-INFORMATIKA-3A.git
```

4. Masuk ke folder proyek

```bash
cd DATABASE-TEKNIK-INFORMATIKA-3A
```

5. Pastikan repository berhasil ter-clone

```bash
git status
```

Jika muncul pesan:

```
On branch main
nothing to commit, working tree clean
```

berarti clone berhasil.

---

## 🌿 3. Membuat Branch Pribadi

⚠️ **Dilarang melakukan commit langsung ke branch `main`.**

Setiap kontributor **WAJIB bekerja di branch masing-masing** agar perubahan tidak saling mengganggu dan mudah ditinjau.

### 3.1 Aturan Commit

Setiap perubahan **WAJIB dikemas dalam commit yang rapi dan terkontrol** agar mudah ditinjau dan digabungkan.

**Ketentuan commit:**

- Pastikan perubahan sudah sesuai dengan **tujuan branch**
- Satu commit merepresentasikan **satu perubahan logis**
- Hindari commit besar yang mencampur banyak hal berbeda
- Lakukan commit secara bertahap dan konsisten

Sebelum melakukan commit, pastikan:

```bash
git status
```

menunjukkan file yang benar dan branch yang sesuai.

**Jenis commit yang digunakan:**

| Jenis Commit | Keterangan                   |
| ------------ | ---------------------------- |
| `feat`       | Penambahan fitur baru        |
| `fix`        | Perbaikan bug                |
| `docs`       | Perubahan dokumentasi        |
| `refactor`   | Perapihan / refactoring kode |

**Contoh checkout branch:**

```bash
git checkout -b feature/checkout-produk
```

Pastikan perintah `git status` menunjukkan branch yang benar sebelum mulai bekerja.

---

## 🧩 4. Standar Penulisan Kode

### 4.1 Database (SQL)

- Gunakan **nama tabel dan kolom lowercase**
- Gunakan **snake_case**
- Setiap tabel **WAJIB memiliki primary key**
- Gunakan foreign key untuk relasi
- Sertakan komentar singkat pada query kompleks

Contoh:

```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4.2 Struktur Folder

- Pisahkan file SQL, dokumentasi, dan aset lain
- Jangan menyimpan file sementara atau hasil backup

---

## 📝 5. Aturan Commit Message

Gunakan commit message yang **jelas, singkat, dan deskriptif**.

### Format Commit Message

Gunakan format berikut agar commit mudah dipahami:

| Jenis      | Kegunaan                          |
| ---------- | --------------------------------- |
| `feat`     | Penambahan fitur baru             |
| `fix`      | Perbaikan bug                     |
| `docs`     | Perubahan dokumentasi             |
| `refactor` | Perapihan struktur kode           |
| `test`     | Penambahan atau perbaikan testing |

**Format penulisan:**

```
<jenis>: <deskripsi singkat>
```

Contoh:

```bash
feat: menambahkan tabel transaksi
fix: perbaikan relasi foreign key produk
```

❌ Hindari commit message seperti:

- `update`
- `fix error`
- `coba-coba`

---

## 🔄 6. Push dan Pull Request

### 6.1 Push ke Branch Pribadi

```bash
git push origin nama-branch
```

---

### 6.2 Membuat Pull Request (PR)

1. Buka repository di GitHub
2. Pilih menu **Pull Requests**
3. Klik **New Pull Request**
4. Bandingkan branch pribadi ke `main`
5. Beri judul dan deskripsi yang jelas

---

### 6.3 Proses Review

- PR akan direview oleh anggota tim atau koordinator
- Jika ada revisi, lakukan perbaikan di branch yang sama
- PR akan di-merge setelah disetujui

---

## 🧪 7. Testing

Setiap perubahan **WAJIB diuji terlebih dahulu**:

- Query SQL dapat dijalankan tanpa error
- Relasi antar tabel berjalan dengan benar
- Data dummy valid dan konsisten

Jika memungkinkan, sertakan:

- Screenshot hasil query
- Penjelasan singkat hasil pengujian

---

## 📦 8. Aturan Dataset

- Gunakan **data dummy**, bukan data asli
- Hindari data sensitif (email asli, nomor telepon nyata)
- Gunakan format yang konsisten
- Dataset harus mendukung skenario e-commerce (user, produk, transaksi)

---

## 🛡 9. Lisensi & Kepatuhan

Proyek ini menggunakan lisensi **Creative Commons BY-NC 4.0**:

- ✔ Wajib mencantumkan atribusi
- ❌ Dilarang digunakan untuk kepentingan komersial
- ✔ Semua kontribusi otomatis mengikuti lisensi yang sama

---

## 🙌 10. Penutup

Terima kasih atas kontribusi dan kerja samanya 🙏

Dengan mengikuti panduan ini, diharapkan proyek dapat berjalan **terstruktur, adil, dan profesional**.
