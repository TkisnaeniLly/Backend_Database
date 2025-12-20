const response = require("response");
const Checkout = require("../../Models/scripts/Checkout/Checkout");
const CheckoutTracking = require("../../Models/scripts/Checkout/CheckoutTracking");
const Cart = require("../../Models/scripts/Cart/Cart");
const CartItem = require("../../Models/scripts/Cart/CartItem");
const Variant = require("../../Models/scripts/Catalog/Variant");
const Product = require("../../Models/scripts/Catalog/Product");

const getCheckoutDetail = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    const checkout = await Checkout.findOne({
      where: { id, user_id },
      include: [
        {
          model: Cart,
          include: [
            {
              model: CartItem,
              include: [
                {
                  model: Variant,
                  include: [{ model: Product }],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!checkout) {
      return response(res, {
        statusCode: 404,
        message: "Data checkout tidak ditemukan",
        data: null,
      });
    }

    const trackings = await CheckoutTracking.findAll({
      where: { checkout_id: id },
      order: [["created_at", "DESC"]],
    });

    // Combine data
    const data = {
      ...checkout.toJSON(),
      trackings,
    };

    return response(res, {
      statusCode: 200,
      message: "Detail checkout berhasil diambil",
      data: data,
    });
  } catch (error) {
    console.error("GetCheckoutDetail Error:", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = getCheckoutDetail;
