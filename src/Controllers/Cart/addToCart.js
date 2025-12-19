const response = require("response");

const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Inventory = require("../../Models/scripts/Catalog/Inventory");

const addToCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { variant_id, qty } = req.body;

    if (!variant_id || !qty || qty < 1) {
      return response(res, {
        statusCode: 400,
        message: "Variant dan quantity wajib diisi",
        data: null,
      });
    }

    const variant = await Variant.findByPk(variant_id, {
      include: [{ model: Inventory }],
    });

    if (!variant || !variant.Inventory) {
      return response(res, {
        statusCode: 404,
        message: "Variant tidak ditemukan",
        data: null,
      });
    }

    if (variant.Inventory.stock_qty < qty) {
      return response(res, {
        statusCode: 400,
        message: "Stok tidak mencukupi",
        data: null,
      });
    }

    let cart = await Cart.findOne({
      where: { user_id, status: "ACTIVE" },
    });

    if (!cart) {
      cart = await Cart.create({ user_id });
    }

    let item = await CartItem.findOne({
      where: { cart_id: cart.id, variant_id },
    });

    if (item) {
      item.qty += qty;
      await item.save();
    } else {
      item = await CartItem.create({
        cart_id: cart.id,
        variant_id,
        qty,
      });
    }

    response(res, {
      statusCode: 200,
      message: "Produk berhasil ditambahkan ke keranjang",
      data: item,
    });
  } catch (error) {
    console.error(error);
    response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = addToCart;
