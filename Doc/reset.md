# 🔐 Dokumentasi Reset Password

Alur **Lupa Password / Reset Password** pada backend aplikasi.

---

## 5️⃣ Request Reset Password (Lupa Password)

**Method:** `POST`  
**Endpoint:**

```
/api/auth/request-reset-password
```

### 📥 Request Body

```json
{
  "email": "mail@gmail.com"
}
```

### 📤 Response (Berhasil)

```json
{
  "statusCode": 200,
  "message": "Permintaan reset password diterima.",
  "data": null
}
```

**Keterangan:**
Jika email terdaftar, sistem akan:
1. Memverifikasi email.
2. Membuat token unik dan OTP.
3. Menyimpan token ke dabase (`reset_token`).
4. Mengirim email ke user berisi Link Reset Password.

---

## 6️⃣ Reset Password (Set Password Baru)

**Method:** `PUT`  
**Endpoint:**

```
/api/auth/reset-password?token=<TOKEN_DARI_EMAIL>
```

### 📥 Request Body

```json
{
  "new_password": "NewStrongP4ssword!"
}
```

### 📤 Response (Berhasil)

```json
{
  "statusCode": 200,
  "message": "Password berhasil direset",
  "data": null
}
```

### ❌ Response (Token Tidak Valid / Kadaluarsa)

```json
{
  "statusCode": 400,
  "message": "Token tidak valid", // atau "Token sudah kadaluarsa"
  "data": null
}
```
