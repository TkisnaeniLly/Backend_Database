# Backend

## 🚀 Menjalankan Backend

### 1. Install dependency

```bash
npm install
```

### 2. Konfigurasi environment

Ganti nama file `.env.sample` menjadi `.env`, lalu sesuaikan nilainya.

```env
PORT=3000
NODE_ENV=development
```

### 3. Jalankan server

```bash
npm run dev
```

---

## 🖥 Contoh Log Terminal

```text
[nodemon] starting `node App.js`
Registered aliases from index.js
🚀 Server running on port 3000
LOG REQUEST {
  path: '/',
  ipClient: '127.0.0.1',
  hostname: 'localhost',
  protocol: 'http',
  method: 'GET',
  dateTime: '15 Desember 2025 pukul 00.30 WIB'
}
```

---

## 📡 Dokumentasi Routes / Endpoint

Endpoint berikut disediakan oleh backend sebagai **REST API**.

---

### 📍 User / Beranda (Protected)

| Method | Endpoint       | Deskripsi                   | Auth |
| ------ | -------------- | --------------------------- | ---- |
| GET    | `/api/`        | Endpoint beranda (home API) | JWT  |
| GET    | `/api/beranda` | Endpoint beranda (home API) | JWT  |
| GET    | `/api/home`    | Endpoint beranda (home API) | JWT  |

**Header wajib**

```
Authorization: Bearer <JWT_TOKEN>
```

---

### 🔐 Autentikasi

| Method | Endpoint                 | Deskripsi                           | Auth |
| ------ | ------------------------ | ----------------------------------- | ---- |
| POST   | `/api/auth/register`     | Registrasi user baru                | ❌   |
| GET    | `/api/auth/verify-email` | Verifikasi email user melalui token | ❌   |
| POST   | `/api/auth/login`        | Login user (mengirim OTP ke email)  | ❌   |
| PUT    | `/api/auth/verify-login` | Verifikasi OTP login & generate JWT | ❌   |
| DELETE | `/api/auth/logout`       | Logout user & invalidasi sesi       | JWT  |

Baca selengkapnya di [Dokumentasi Auth](Doc/authentikasi.md).

#### 🔄 Alur Autentikasi

```text
Register
   ↓
Email verifikasi (link + token)
   ↓
Email terverifikasi
   ↓
Login (email + password)
   ↓
OTP dikirim ke email
   ↓
Verifikasi OTP
   ↓
JWT aktif
   ↓
Akses API terproteksi
   ↓
Logout
```

---

### 📦 Catalog / Produk

| Method | Endpoint              | Deskripsi                            | Auth |
| ------ | --------------------- | ------------------------------------ | ---- |
| GET    | `/api/catalog`        | Ambil semua produk                   | ❌   |
| GET    | `/api/catalog/:slug`  | Ambil detail produk berdasarkan slug | ❌   |
| GET    | `/api/products`       | Ambil semua produk                   | ❌   |
| GET    | `/api/products/:slug` | Ambil detail produk berdasarkan slug | ❌   |

Baca selengkapnya di [Dokumentasi Products/Catalog](Doc/product.md).

---

### 🛒 Cart / Keranjang

| Method | Endpoint             | Deskripsi                     | Auth |
| ------ | -------------------- | ----------------------------- | ---- |
| GET    | `/api/cart`          | Ambil keranjang milik user    | JWT  |
| POST   | `/api/cart/add`      | Tambah item ke keranjang      | JWT  |
| PUT    | `/api/cart/update`   | Update qty & varian item cart | JWT  |
| DELETE | `/api/cart/delete`   | Kurangi qty / hapus item cart | JWT  |
| POST   | `/api/cart/checkout` | Checkout keranjang user       | JWT  |

Baca selengkapnya di [Dokumentasi Cart](Doc/cart.md).

---

## 🔐 Keamanan API

- Semua request & response menggunakan format **JSON**
- Endpoint terproteksi **wajib** menyertakan:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- JWT berlaku selama **1 hari**
- OTP login berlaku selama **5 menit**
- Token verifikasi email bersifat **sekali pakai**

---

## 🧠 Dokumentasi App.js

`App.js` berfungsi sebagai **entry point** aplikasi backend dengan alur:

1. Inisialisasi Express
2. Registrasi middleware global
3. Registrasi routes
4. Menjalankan server berdasarkan `PORT` dari environment

---

## 📌 Baca terlebih dahulu file

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [CONTRIBUTING.md](CONTRIBUTING.md), dan [GIT_WORKFLOW.md](GIT_WORKFLOW.md)  
agar tidak terjadi kesalahan saat mengembangkan aplikasi ini.
