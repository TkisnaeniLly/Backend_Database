const response = require("response");
const { Op } = require("sequelize");
const {
  Checkout,
  Cart,
  CartItem,
  Variant,
  Inventory,
  UserProfile,
} = require("../../Models");

const processCheckout = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    let { shipping_address, payment_method, cart_item_ids } = req.body;

    if (!shipping_address) {
      const userProfile = await UserProfile.findOne({ where: { user_id } });
      if (userProfile && userProfile.address) {
        shipping_address = userProfile.address;
      }
    }

    if (!shipping_address || !payment_method) {
      return response(res, {
        statusCode: 400,
        message: "Alamat pengiriman dan metode pembayaran wajib diisi",
        data: null,
      });
    }

    const cart = await Cart.findOne({
      where: { user_id, status: "ACTIVE" },
    });

    if (!cart) {
      return response(res, {
        statusCode: 404,
        message: "Keranjang tidak ditemukan atau kosong",
        data: null,
      });
    }

    let filterWhere = { cart_id: cart.id };
    let isPartialCheckout = false;

    if (cart_item_ids) {
      if (!Array.isArray(cart_item_ids)) {
        cart_item_ids = [cart_item_ids];
      }
      if (cart_item_ids.length > 0) {
        filterWhere.id = { [Op.in]: cart_item_ids };
        isPartialCheckout = true;
      }
    }

    const cartItems = await CartItem.findAll({
      where: filterWhere,
      include: [
        {
          model: Variant,
          include: [{ model: Inventory }],
        },
      ],
    });

    if (cartItems.length === 0) {
      return response(res, {
        statusCode: 400,
        message: "Item yang dipilih tidak ditemukan di keranjang",
        data: null,
      });
    }

    if (isPartialCheckout && cartItems.length !== cart_item_ids.length) {
      return response(res, {
        statusCode: 400,
        message: "Beberapa item tidak ditemukan atau tidak valid.",
        data: null,
      });
    }

    let total_amount = 0;

    for (const item of cartItems) {
      if (!item.Variant || !item.Variant.Inventory) {
        return response(res, {
          statusCode: 400,
          message: `Data produk tidak valid untuk item id ${item.id}`,
          data: null,
        });
      }
      if (item.Variant.Inventory.stock_qty < item.qty) {
        return response(res, {
          statusCode: 400,
          message: `Stok tidak mencukupi untuk produk ${item.Variant.name}`,
          data: null,
        });
      }
      total_amount += Number(item.Variant.price) * item.qty;
    }

    let checkoutCartId = cart.id;

    if (isPartialCheckout) {
      const newCart = await Cart.create({
        user_id,
        status: "ACTIVE",
      });

      const itemIds = cartItems.map((item) => item.id);
      await CartItem.update(
        { cart_id: newCart.id },
        { where: { id: { [Op.in]: itemIds } } }
      );

      checkoutCartId = newCart.id;
    }

    const checkout = await Checkout.create({
      user_id,
      cart_id: checkoutCartId,
      total_amount,
      shipping_address,
      payment_method,
      status: "PENDING",
    });

    await Cart.update(
      { status: "CHECKOUT" },
      { where: { id: checkoutCartId } }
    );

    return response(res, {
      statusCode: 200,
      message: "Checkout berhasil",
      data: checkout,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = processCheckout;
