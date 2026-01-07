const response = require("response");
const { Checkout, CheckoutTracking } = require("../../../../Models");

const paidVerify = async (req, res) => {
  try {
    const { checkout_id } = req.body;

    if (!checkout_id) {
      return response(res, {
        statusCode: 400,
        message: "Checkout ID diperlukan.",
        data: null,
      });
    }

    const checkout = await Checkout.findOne({ where: { id: checkout_id } });

    if (!checkout) {
      return response(res, {
        statusCode: 404,
        message: "Data Checkout tidak ditemukan.",
        data: null,
      });
    }

    if (checkout.status === "PAID") {
      return response(res, {
        statusCode: 400,
        message: "Checkout sudah dibayar sebelumnya.",
        data: null,
      });
    }

    if (checkout.status === "CANCELLED") {
      return response(res, {
        statusCode: 400,
        message: "Checkout telah dibatalkan, tidak dapat diproses.",
        data: null,
      });
    }

    // Update status
    await checkout.update({ status: "PAID" });

    // Add tracking history
    await CheckoutTracking.create({
      checkout_id: checkout.id,
      status: "PAID",
      description:
        "Pembayaran telah diverifikasi oleh Admin paket menunggu penjemputan oleh kurir.",
      location: "Gudang ITShop",
    });

    return response(res, {
      statusCode: 200,
      message: "Verifikasi pembayaran berhasil.",
      data: checkout,
    });
  } catch (error) {
    console.error("Error paidVerify:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = paidVerify;
