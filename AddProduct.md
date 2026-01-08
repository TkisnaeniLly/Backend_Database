# 📘 Dokumentasi Add Product via JSON

Dokumentasi ini menjelaskan cara **mengisi JSON untuk menambahkan produk** ke sistem, mencakup struktur data, field wajib & opsional, daftar variant yang didukung, serta kategori produk yang tersedia.

---

## 📌 1. Struktur Umum JSON

### 🔹 Single Product

```json
{
  "product_name": "Nama Produk",
  "description": "Deskripsi produk",
  "category": {
    "main": "kategori-utama",
    "additional": ["kategori-tambahan"]
  },
  "brand": "Nama Brand",
  "is_featured": false,
  "media": [],
  "variants": []
}
```

### 🔹 Multiple Product (Batch Import)

```json
{
  "products": [
    {
      /* product 1 */
    },
    {
      /* product 2 */
    }
  ]
}
```

---

## 📌 2. Field Product

| Field          | Tipe    | Wajib | Keterangan                              |
| -------------- | ------- | ----- | --------------------------------------- |
| `product_name` | string  | ✅    | Nama produk                             |
| `description`  | string  | ❌    | Deskripsi produk                        |
| `brand`        | string  | ❌    | Nama brand (auto-create jika belum ada) |
| `is_featured`  | boolean | ❌    | Produk unggulan                         |
| `category`     | object  | ✅    | Kategori produk                         |
| `media`        | array   | ❌    | Media / gambar produk                   |
| `variants`     | array   | ✅    | Variant produk (minimal 1)              |

---

## 📌 3. Kategori Produk (`category`)

### 🔹 Struktur

```json
"category": {
  "main": "sepatu",
  "additional": ["pria", "olahraga"]
}
```

### 🔹 Aturan

- `main` → **WAJIB**, hanya satu
- `additional` → **OPSIONAL**, bisa lebih dari satu
- Semua kategori **harus tersedia di database**

### 🔹 Daftar Kategori Umum

| Kategori    | Keterangan      |
| ----------- | --------------- |
| `sepatu`    | Alas kaki       |
| `t-shirt`   | Kaos            |
| `celana`    | Celana          |
| `jaket`     | Jaket           |
| `aksesoris` | Topi, tas, dll  |
| `pria`      | Target pria     |
| `wanita`    | Target wanita   |
| `anak`      | Target anak     |
| `olahraga`  | Produk olahraga |
| `formal`    | Produk formal   |
| `casual`    | Produk santai   |

---

## 📌 4. Media Produk (`media`)

```json
"media": [
  {
    "media_url": "/images/products/produk-1.webp",
    "position": 1
  }
]
```

| Field       | Tipe   | Wajib | Keterangan        |
| ----------- | ------ | ----- | ----------------- |
| `media_url` | string | ✅    | Path / URL gambar |
| `position`  | number | ❌    | Urutan media      |

---

## 📌 5. Variant Produk (`variants`)

Setiap produk **WAJIB memiliki minimal 1 variant**.

### 🔹 Struktur Variant

```json
{
  "variant_type": "SIZE",
  "variant_value": "L",
  "price": 79000,
  "inventory": {}
}
```

---

## 📌 6. Variant Type yang Didukung

Gunakan **HURUF BESAR**.

| Variant Type | Keterangan    |
| ------------ | ------------- |
| `SIZE`       | Ukuran produk |
| `COLOR`      | Warna         |
| `MATERIAL`   | Bahan         |
| `MODEL`      | Model / seri  |
| `CAPACITY`   | Kapasitas     |

---

## 📌 7. Inventory / Stok Variant

```json
"inventory": {
  "stock_qty": 20,
  "stock_minimum": 5,
  "stock_status": "AVAILABLE"
}
```

| Field           | Tipe   | Wajib | Keterangan         |
| --------------- | ------ | ----- | ------------------ |
| `stock_qty`     | number | ✅    | Jumlah stok        |
| `stock_minimum` | number | ❌    | Batas minimum stok |
| `stock_status`  | string | ❌    | Status stok        |

### 🔹 Stock Status yang Didukung

| Status         | Keterangan        |
| -------------- | ----------------- |
| `AVAILABLE`    | Stok tersedia     |
| `OUT_OF_STOCK` | Stok habis        |
| `DISCONTINUED` | Tidak dijual lagi |

---

## 📌 8. Aturan Harga (`price`)

✅ **Harus integer (tanpa titik atau string)**

```json
"price": 299000
```

❌ Salah:

```json
"price": "299.000"
```

---

## 📌 9. Contoh JSON Lengkap

### Single Variant

```json
{
  "product_name": "Jaket Outdoor Pro",
  "description": "Jaket tahan angin dan hujan ringan.",
  "brand": "MountGear",
  "is_featured": true,
  "category": {
    "main": "jaket",
    "additional": ["pria", "olahraga"]
  },
  "media": [
    {
      "media_url": "/images/products/jaket-outdoor.webp",
      "position": 1
    }
  ],
  "variants": [
    {
      "variant_type": "SIZE",
      "variant_value": "L",
      "price": 249000,
      "inventory": {
        "stock_qty": 12,
        "stock_minimum": 3,
        "stock_status": "AVAILABLE"
      }
    }
  ]
}
```

### Multiple Variant

```json
{
  "products": [
    {
      "product_name": "T-Shirt Basic Cotton",
      "description": "Kaos katun nyaman untuk aktivitas sehari-hari.",
      "category": {
        "main": "t-shirt",
        "additional": ["pria", "wanita"]
      },
      "brand": "DailyWear",
      "is_featured": false,
      "media": [
        {
          "media_url": "/images/products/tshirt-basic.webp",
          "position": 1
        }
      ],
      "variants": [
        {
          "variant_type": "SIZE",
          "variant_value": "M",
          "price": 79000,
          "inventory": {
            "stock_qty": 30,
            "stock_minimum": 5,
            "stock_status": "AVAILABLE"
          }
        },
        {
          "variant_type": "SIZE",
          "variant_value": "L",
          "price": 79000,
          "inventory": {
            "stock_qty": 25,
            "stock_minimum": 5,
            "stock_status": "AVAILABLE"
          }
        }
      ]
    }
  ]
}
```

---

## ⚠️ 10. Error Umum

- `variants` kosong
- `category.main` tidak diisi
- `price` bukan angka
- `variant_type` tidak valid
- Kategori tidak terdaftar di database

---

## ✅ Best Practice

- Gunakan **1 produk = 1 JSON object**
- Gunakan **batch JSON** untuk import banyak data
- Pastikan kategori & enum sesuai database
- Simpan file sebagai `.json` valid

---

📌 Dokumentasi ini dapat digunakan sebagai **README.md** untuk tim backend, frontend, maupun admin sistem.
