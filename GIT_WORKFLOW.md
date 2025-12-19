# 🔀 GIT_WORKFLOW.md – Alur Kerja Git Proyek Basis Data

Dokumen ini menjelaskan **alur kerja Git (Git Workflow)** yang wajib diikuti oleh seluruh anggota tim dalam proyek aplikasi **E‑Commerce Basis Data**. Tujuannya agar kolaborasi rapi, minim konflik, dan mudah dinilai.

---

## 🎯 Tujuan Git Workflow

- Menjaga struktur repository tetap bersih
- Mencegah konflik antar anggota
- Memudahkan tracking kontribusi masing‑masing mahasiswa
- Membiasakan workflow Git yang sesuai praktik industri

---

## 🌳 Struktur Branch

Repository menggunakan beberapa jenis branch:

| Jenis Branch | Fungsi             | Keterangan                                 |
| ------------ | ------------------ | ------------------------------------------ |
| `main`       | Branch utama       | Berisi hasil akhir proyek (final)          |
| `nama_nim`   | Branch individu    | Digunakan untuk tugas & eksperimen pribadi |
| `feature/*`  | Pengembangan fitur | Digabung ke branch tugas / main            |
| `fix/*`      | Perbaikan bug      | Untuk bug atau error                       |
| `docs/*`     | Dokumentasi        | Markdown, ERD, laporan                     |

⚠️ **Dilarang push langsung ke `main` tanpa Pull Request.**

---

## 🧭 Alur Kerja Umum

1. Clone repository
2. Checkout ke branch masing‑masing
3. Kerjakan perubahan
4. Commit dengan aturan yang benar
5. Push ke GitHub
6. Buat Pull Request (jika diminta)

---

## 🔹 Tahap 1 – Analisis & Normalisasi Tabel

### 🎯 Tujuan

- Menganalisis tabel awal
- Menentukan tabel **layak disimpan di database** atau **cukup sebagai proses aplikasi**
- Menjelaskan alasannya secara logis

### 📁 Output Wajib

- File Markdown analisis normalisasi
- Dikerjakan di **branch pribadi**

### 🪜 Langkah‑langkah

#### 1️⃣ Checkout ke branch masing‑masing

```bash
git checkout -b nama_nim
```

Contoh:

```bash
git checkout -b khilmy_24225029
```

#### 2️⃣ Buat file Markdown

Nama file bebas, contoh:

- `NORMALISASI.md`
- `analisis_normalisasi.md`

📌 **Boleh dibuat lewat VS Code (New File)**, tidak wajib via terminal.

#### 3️⃣ Isi minimal dokumen

- Deskripsi tabel awal
- Hasil normalisasi (1NF, 2NF, 3NF)
- Keputusan:

  - Disimpan sebagai tabel
  - Atau hanya proses aplikasi

- Alasan teknis

#### 4️⃣ Commit perubahan

```bash
git add .
git commit -m "docs: analisis normalisasi tabel"
```

#### 5️⃣ Push ke GitHub

```bash
git push origin nama_nim
```

---

## 🔹 Tahap 2 – Pembagian Tugas Tim

### 🎯 Tujuan

Menentukan tanggung jawab setiap anggota agar pengembangan terarah.

### 📌 Contoh Pembagian

- UI Designer
- Frontend Developer
- Backend Developer
- UX & Testing

### 🪜 Langkah‑langkah

#### 1️⃣ Checkout ke branch yang ditentukan PM

```bash
git checkout nama_branch
```

#### 2️⃣ Buat / edit file pembagian tugas

Contoh file:

- `TASK_DIVISION.md`

Isi minimal:

- Nama anggota
- NIM
- Role / tanggung jawab

#### 3️⃣ Commit perubahan

```bash
git add .
git commit -m "docs: pembagian tugas tim"
```

#### 4️⃣ Push ke GitHub

```bash
git push origin nama_branch
```

---

## 🔹 Tahap 3 – Finalisasi

### 🎯 Tujuan

- Integrasi seluruh fitur
- Perbaikan bug
- Rapikan dokumentasi
- Persiapan penilaian

### Aturan

- Gunakan Pull Request
- Pastikan tidak ada konflik
- Ikuti Code of Conduct

---

## ✍️ Aturan Commit (WAJIB)

Gunakan format berikut:

| Prefix      | Digunakan untuk  |
| ----------- | ---------------- |
| `feat:`     | Penambahan fitur |
| `fix:`      | Perbaikan bug    |
| `docs:`     | Dokumentasi      |
| `refactor:` | Perapihan kode   |
| `test:`     | Testing          |

Contoh:

```bash
git commit -m "feat: menambahkan fitur checkout"
```

---

## 🔐 Autentikasi GitHub

### Konfigurasi Identitas

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@kampus.ac.id"
```

### Opsi Koneksi

#### HTTPS

```bash
git clone https://github.com/TkisnaeniLly/DATABASE-TEKNIK-INFORMATIKA-3A.git
```

#### SSH (Direkomendasikan)

1. Generate key

```bash
ssh-keygen -t ed25519 -C "email@kampus.ac.id"
```

2. Tambahkan ke GitHub (Settings → SSH Keys)

3. Load SSH key

```bash
ssh-add ~/.ssh/id_ed25519
```

Atau gunakan script otomatis berikut.

### Linux / macOS (Shell Script)

Simpan sebagai `connectSshGithub.sh` lalu jalankan.

```bash
#!/bin/bash

KEY="$HOME/.ssh/id_ed25519"

if [ -z "$SSH_AUTH_SOCK" ]; then
  echo "🔐 Starting SSH agent..."
  eval "$(ssh-agent -s)"
fi

echo "➕ Adding SSH key..."
ssh-add "$KEY" || exit 1

echo "✅ SSH key loaded:"
ssh-add -l

echo "🔗 Testing GitHub SSH connection..."
ssh -T git@github.com

echo "🚀 SSH GitHub ready!"
```

Jalankan:

```bash
chmod +x connectSshGithub.sh
./connectSshGithub.sh
```

---

### Windows (Git Bash / CMD – Batch File)

Simpan sebagai `connectSshGithub.bat`.

```bat
@echo off
set KEY=%USERPROFILE%\.ssh\id_ed25519

echo 🔐 Starting SSH agent...
for /f "tokens=*" %%i in ('ssh-agent') do %%i

echo ➕ Adding SSH key...
ssh-add "%KEY%"
if errorlevel 1 exit /b 1

echo ✅ SSH key loaded:
ssh-add -l

echo 🔗 Testing GitHub SSH connection...
ssh -T git@github.com

echo 🚀 SSH GitHub ready!
pause
```

📌 **Catatan Windows:**

- Jalankan lewat **Git Bash** atau **Command Prompt**
- Pastikan OpenSSH sudah terinstal

---

## 🚫 Larangan Umum

- Push langsung ke `main`
- Commit tanpa pesan jelas
- Menghapus kerja anggota lain
- Upload file sensitif

---

## 🙌 Penutup

Git Workflow ini **WAJIB diikuti oleh seluruh anggota tim**.

Ketidakpatuhan dapat menyebabkan konflik repository dan pengurangan nilai.

Selamat bekerja dan semangat menyelesaikan proyek 🚀
