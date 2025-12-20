const response = require("response");
const Checkout = require("../../Models/scripts/Checkout/Checkout");
const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Inventory = require("../../Models/scripts/Catalog/Inventory");

const processCheckout = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Assumes user is attached to req by middleware
    const { shipping_address, payment_method } = req.body;

    if (!shipping_address || !payment_method) {
      return response(res, {
        statusCode: 400,
        message: "Alamat pengiriman dan metode pembayaran wajib diisi",
        data: null,
      });
    }

    // Find active cart
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

    // Get cart items to calculate total amount and validate stock
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
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
        message: "Keranjang kosong",
        data: null,
      });
    }

    let total_amount = 0;

    // Check stock and calculate total
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

    // Create Checkout Record
    const checkout = await Checkout.create({
      user_id,
      cart_id: cart.id,
      total_amount,
      shipping_address,
      payment_method,
      status: "PENDING",
    });

    // Update Cart Status
    cart.status = "CHECKOUT";
    await cart.save();

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
