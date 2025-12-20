const response = require("response");
const Checkout = require("../../Models/scripts/Checkout/Checkout");

const getCheckoutHistory = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const history = await Checkout.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    return response(res, {
      statusCode: 200,
      message: "Riwayat checkout berhasil diambil",
      data: history,
    });
  } catch (error) {
    console.error("GetCheckoutHistory Error:", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = getCheckoutHistory;
