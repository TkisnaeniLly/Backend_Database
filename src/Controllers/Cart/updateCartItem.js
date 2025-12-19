const response = require("response");

const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Inventory = require("../../Models/scripts/Catalog/Inventory");

const updateCartItem = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { item_id, qty, variant_id } = req.body;

    if (!item_id) {
      return response(res, {
        statusCode: 400,
        message: "item_id wajib diisi",
        data: null,
      });
    }

    if (qty !== undefined && qty < 1) {
      return response(res, {
        statusCode: 400,
        message: "Qty harus lebih dari 0",
        data: null,
      });
    }

    const cart = await Cart.findOne({
      where: {
        user_id,
        status: "ACTIVE",
      },
    });

    if (!cart) {
      return response(res, {
        statusCode: 404,
        message: "Keranjang tidak ditemukan",
        data: null,
      });
    }

    const item = await CartItem.findOne({
      where: {
        id: item_id,
        cart_id: cart.id,
      },
    });

    if (!item) {
      return response(res, {
        statusCode: 404,
        message: "Item keranjang tidak ditemukan",
        data: null,
      });
    }

    if (variant_id && variant_id !== item.variant_id) {
      const newVariant = await Variant.findByPk(variant_id, {
        include: [Inventory],
      });

      if (!newVariant || !newVariant.Inventory) {
        return response(res, {
          statusCode: 404,
          message: "Varian tidak ditemukan",
          data: null,
        });
      }

      const existingItem = await CartItem.findOne({
        where: {
          cart_id: cart.id,
          variant_id,
        },
      });

      const finalQty =
        (existingItem ? existingItem.qty : 0) + (qty ? qty : item.qty);

      if (newVariant.Inventory.stock_qty < finalQty) {
        return response(res, {
          statusCode: 400,
          message: "Stok tidak mencukupi",
          data: null,
        });
      }

      if (existingItem) {
        existingItem.qty = finalQty;
        await existingItem.save();

        await item.destroy();

        return response(res, {
          statusCode: 200,
          message: "Varian diperbarui dan item digabung",
          data: existingItem,
        });
      }

      // Jika belum ada → update variant
      item.variant_id = variant_id;
    }

    if (qty) {
      const variant = await Variant.findByPk(item.variant_id, {
        include: [Inventory],
      });

      const newQty = item.qty + qty;

      if (variant.Inventory.stock_qty < newQty) {
        return response(res, {
          statusCode: 400,
          message: "Stok tidak mencukupi",
          data: null,
        });
      }

      item.qty = newQty;
    }

    await item.save();

    response(res, {
      statusCode: 200,
      message: "Item keranjang berhasil diperbarui",
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

module.exports = updateCartItem;
