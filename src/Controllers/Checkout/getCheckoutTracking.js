const response = require("response");
const CheckoutTracking = require("../../Models/scripts/Checkout/CheckoutTracking");
const Checkout = require("../../Models/scripts/Checkout/Checkout");

const getCheckoutTracking = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { id } = req.params;

    // Verify ownership
    const checkout = await Checkout.findOne({
      where: { id, user_id },
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

    return response(res, {
      statusCode: 200,
      message: "Data tracking berhasil diambil",
      data: trackings,
    });
  } catch (error) {
    console.error("GetCheckoutTracking Error:", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = getCheckoutTracking;
