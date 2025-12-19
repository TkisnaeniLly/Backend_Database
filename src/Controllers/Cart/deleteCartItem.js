const response = require("response");

const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");

const deleteCartItem = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { item_id, qty } = req.body;

    if (!item_id || qty === undefined) {
      return response(res, {
        statusCode: 400,
        message: "item_id dan qty wajib diisi",
        data: null,
      });
    }

    const reduceQty = parseInt(qty, 10);

    if (isNaN(reduceQty) || reduceQty < 0) {
      return response(res, {
        statusCode: 400,
        message: "qty harus berupa angka >= 0",
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

    if (reduceQty === 0) {
      return response(res, {
        statusCode: 200,
        message: "Qty 0, tidak ada perubahan pada keranjang",
        data: item,
      });
    }

    if (reduceQty > item.qty) {
      return response(res, {
        statusCode: 400,
        message: "Qty yang dikurangi melebihi jumlah item",
        data: null,
      });
    }

    const remainingQty = item.qty - reduceQty;

    if (remainingQty === 0) {
      await item.destroy();

      return response(res, {
        statusCode: 200,
        message: "Item berhasil dihapus dari keranjang",
        data: null,
      });
    }

    item.qty = remainingQty;
    await item.save();

    response(res, {
      statusCode: 200,
      message: "Jumlah item berhasil dikurangi",
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

module.exports = deleteCartItem;
