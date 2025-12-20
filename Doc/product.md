## 📦 Catalog / Produk (Public)

| Method | Endpoint              | Deskripsi                            | Auth |
| ------ | --------------------- | ------------------------------------ | ---- |
| GET    | `/api/catalog`        | Ambil semua produk                   | ❌   |
| GET    | `/api/catalog/:slug`  | Ambil detail produk berdasarkan slug | ❌   |
| GET    | `/api/products`       | Ambil semua produk                   | ❌   |
| GET    | `/api/products/:slug` | Ambil detail produk berdasarkan slug | ❌   |

### GET `/api/products` atau `/api/catalog`

Mengambil daftar produk beserta **brand, kategori, gambar utama, dan harga awal**.

#### ✅ Response (200)

```json
{
  "statusCode": 200,
  "message": "Data katalog produk",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "brand_id": 1,
      "product_name": "Erigo T-Shirt Basic Oversize",
      "slug": "erigo-t-shirt-basic-oversize",
      "description": "Kaos oversize bahan cotton combed 24s, nyaman dipakai harian.",
      "status": "ACTIVE",
      "created_at": "2025-12-16T02:50:24.000Z",
      "updated_at": "2025-12-16T02:50:24.000Z",
      "Category": {
        "id": 1,
        "category_name": "T-Shirt"
      },
      "Brand": {
        "id": 1,
        "brand_name": "Erigo"
      },
      "Media": [
        {
          "media_url": "/images/products/erigo-tshirt-1.jpg",
          "position": 1
        }
      ],
      "Variants": [
        {
          "id": 1,
          "variant_type": "SIZE",
          "variant_value": "M",
          "price": "99000.00"
        },
        {
          "id": 2,
          "variant_type": "SIZE",
          "variant_value": "L",
          "price": "99000.00"
        }
      ]
    }
  ]
}
```

### GET `/api/products/:slug` atau `/api/catalog/:slug`

Mengambil detail produk beserta by slug.

#### ✅ Response (200)

```json
{
  "statusCode": 200,
  "message": "Detail produk",
  "data": {
    "id": 3,
    "category_id": 4,
    "brand_id": 3,
    "product_name": "Compass Gazelle Low Black White",
    "slug": "compass-gazelle-low-black-white",
    "description": "Sepatu lokal premium dengan desain klasik dan sol kuat.",
    "status": "ACTIVE",
    "created_at": "2025-12-16T02:50:24.000Z",
    "updated_at": "2025-12-16T02:50:24.000Z",
    "Category": {
      "id": 4,
      "category_name": "Sepatu"
    },
    "Brand": {
      "id": 3,
      "brand_name": "Compass"
    },
    "Media": [
      {
        "media_url": "/images/products/compass-gazelle-1.jpg",
        "position": 1
      }
    ],
    "Variants": [
      {
        "id": 3,
        "variant_type": "SIZE",
        "variant_value": "42",
        "price": "698000.00",
        "Inventory": {
          "stock_qty": 20,
          "stock_status": "AVAILABLE"
        }
      }
    ]
  }
}
```
