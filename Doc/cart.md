### 🛒 Cart / Keranjang

| Method | Endpoint             | Deskripsi                      | Auth |
| ------ | -------------------- | ------------------------------ | ---- |
| GET    | `/api/cart`          | Ambil keranjang milik user     | JWT  |
| POST   | `/api/cart/add`      | Tambah item ke keranjang       | JWT  |
| PUT    | `/api/cart/update`   | Update qty & varian item cart  | JWT  |
| DELETE | `/api/cart/delete`   | Kurangi qty / hapus item cart  | JWT  |
| POST   | `/api/cart/checkout` | Checkout keranjang user        | JWT  |

### GET `/api/cart`

Mengambil daftar keranjang milik user.

#### ✅ Response (200)

```json
{
  "statusCode": 200,
  "message": "Data keranjang",
  "data": {
    "cart_id": 1,
    "items": [
      {
        "cart_item_id": 1,
        "qty": 4,
        "price": "99000.00",
        "subtotal": 396000,
        "variant": {
          "id": 1,
          "type": "SIZE",
          "value": "M"
        },
        "product": {
          "id": 1,
          "name": "Erigo T-Shirt Basic Oversize",
          "slug": "erigo-t-shirt-basic-oversize",
          "image": "/images/products/erigo-tshirt-1.jpg"
        },
        "stock": {
          "qty": 50,
          "status": "AVAILABLE"
        }
      }
    ],
    "total_qty": 4,
    "total_price": 396000
  }
}
```

### POST `/api/cart/add`

Menambahkan item ke keranjang.

#### Body :

```json
{
  "variant_id": 2,
  "qty": 2
}
```

#### ✅ Response (200)

```json
{
  "statusCode": 200,
  "message": "Produk berhasil ditambahkan ke keranjang",
  "data": {
    "id": 3,
    "cart_id": 1,
    "variant_id": 2,
    "qty": 2,
    "updated_at": "2025-12-17T05:58:54.967Z",
    "created_at": "2025-12-17T05:58:54.967Z"
  }
}
```
### PUT `/api/cart/update`

Updates qty & varian item cart.

#### Body :
Opsi 1 : Update jumlah qty.
```json
{
  "item_id": 1,
  "qty": 2
}
``` 

Opsi 2 : Update variant.
```json
{
  "item_id": 1,
  "variant_id": 2
}
```

Opsi 3 : Tambah qty + variant.
```json
{
  "item_id": 1,
  "qty": 2,
  "variant_id": 2
}
```

#### ✅ Response (200)

```json
{
    "statusCode": 200,
    "message": "Item keranjang berhasil diperbarui",
    "data": {
        "id": 1,
        "cart_id": 1,
        "variant_id": 2,
        "qty": 14,
        "created_at": "2025-12-17T07:56:25.000Z",
        "updated_at": "2025-12-17T08:00:54.216Z"
    }
}
```

### DELETE `/api/cart/delete`

Mengurangi qty / hapus item cart.

### Body 

```json
{
  "item_id": 1,
  "qty": 10
}
```

### ✅ Response (200)

```json
{
    "statusCode": 200,
    "message": "Jumlah item berhasil dikurangi",
    "data": {
        "id": 1,
        "cart_id": 1,
        "variant_id": 2,
        "qty": 4,
        "created_at": "2025-12-17T07:56:25.000Z",
        "updated_at": "2025-12-17T08:01:03.128Z"
    }
}
```

