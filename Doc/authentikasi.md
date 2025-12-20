# 🔐 Dokumentasi Endpoint Autentikasi & Akses API

Alur **Register + Login + OTP + Akses API + Logout** pada backend aplikasi.

---

## 0️⃣ Register (Pendaftaran User)

**Method:** `POST`  
**Endpoint:**

```
/api/auth/register
```

### 📥 Request Body (Semua Field Wajib)

```json
{
  "username": "username",
  "password": "p4s$w0RdAm4n",
  "email": "mail@gmail.com",
  "phone_number": "08888888888",
  "role": "user",
  "full_name": "Nama Anda",
  "gender": "L", // L / P
  "birth_date": "yyyy-mm-dd" //"2002-11-17"
}
```

### ❌ Response – Tidak Valid (400)

**Username sudah terdaftar**

```json
{
  "statusCode": 400,
  "message": "Username sudah terdaftar.",
  "data": null
}
```

**Email sudah digunakan**

```json
{
  "statusCode": 400,
  "message": "Email sudah digunakan.",
  "data": null
}
```

**Password lemah**

```json
{
  "statusCode": 400,
  "message": "Password terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.",
  "data": null
}
```

### ✅ Response – Valid (200)

```json
{
  "statusCode": 200,
  "message": "Berhasil Mendaftar, silahkan konfirmasi email anda.",
  "data": null
}
```

📌 **Catatan**

- Username & Email harus unik
- Password minimal 8 karakter dengan kombinasi kompleks
- User belum aktif sampai email dikonfirmasi, cek inbox email untuk konfirmasi.

---

## 1️⃣ Login (Kirim OTP ke Email)

**Method:** `POST`  
**Endpoint:**

```
/api/auth/login
```

### 📥 Request Body

```json
{
  "email": "mail@gmail.com",
  "password": "p4s$w0RdAm4n"
}
```

### 📤 Response (Berhasil)

```json
{
  "statusCode": 200,
  "message": "OTP login telah dikirim ke email Anda. Silakan cek inbox atau folder spam.",
  "data": {
    "email": "mail@gmail.com",
    "device_id": "f2683e3cb8b42a80bef83670a810be5d",
    "device_name": "Unknown Browser on Unknown OS (desktop)",
    "expires_in": "5 menit"
  }
}
```

---

## 2️⃣ Verifikasi OTP Login

**Method:** `PUT`  
**Endpoint:**

```
/api/auth/verify-login
```

### 📥 Request Body

```json
{
  "email": "mail@gmail.com",
  "device_id": "f2683e3cb8b42a80bef83670a810be5d",
  "otp": "000000"
}
```

### 📤 Response (Berhasil)

```json
{
  "statusCode": 200,
  "message": "Login berhasil.",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "user_id": 2,
      "email": "mail@gmail.com",
      "full_name": "Mr KSvt",
      "role": "user"
    },
    "expires_in": "1 hari"
  }
}
```

---

## 3️⃣ Home / Beranda (Endpoint Terproteksi)

**Method:** `GET`  
**Endpoint:**

```
/api/beranda
```

### 🔐 Header

```
Authorization: Bearer <JWT_TOKEN>
```

### ✅ Response (Token Valid)

```json
{
  "statusCode": 200,
  "message": "API Basis Data 2",
  "data": null
}
```

### ❌ Response (Token Tidak Valid)

```json
{
  "statusCode": 401,
  "message": "Token tidak valid. Silakan login kembali.",
  "data": null
}
```

---

## 4️⃣ Logout

**Method:** `DELETE`  
**Endpoint:**

```
/api/auth/logout
```

### 🔐 Header

```
Authorization: Bearer <JWT_TOKEN>
```

### ✅ Response (Berhasil)

```json
{
  "statusCode": 200,
  "message": "Logout berhasil. Anda telah keluar dari sistem.",
  "data": {
    "user_id": 2,
    "email": "mail@gmail.com",
    "device_id": "f2683e3cb8b42a80bef83670a810be5d",
    "logged_out_at": "2025-12-15T17:46:47.474Z"
  }
}
```

### ❌ Response (Token Tidak Valid)

```json
{
  "statusCode": 401,
  "message": "Token tidak valid. Silakan login kembali.",
  "data": null
}
```


