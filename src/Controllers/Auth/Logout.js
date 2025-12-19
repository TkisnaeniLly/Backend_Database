const { User, UserLoginDevice } = require("../../Models");
const response = require("response");

const Logout = async (req, res) => {
  try {
    const { device_id } = req.body;
    const user_data = req.user;

    if (!device_id) {
      return response(res, {
        statusCode: 400,
        message: "Device ID wajib diisi.",
        data: null,
      });
    }

    const device = await UserLoginDevice.findOne({
      where: {
        user_id: user_data.user_id,
        device_id,
      },
    });

    if (!device) {
      return response(res, {
        statusCode: 404,
        message: "Device tidak ditemukan atau bukan milik Anda.",
        data: null,
      });
    }

    await device.update({ is_verified: false });

    const user = await User.findByPk(user_data.user_id);
    await user.increment("token_version");

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log(
      `✅ Logout berhasil: user_id=${user_data.user_id}, device_id=${device_id}`
    );

    return response(res, {
      statusCode: 200,
      message: "Logout berhasil. Anda telah keluar dari sistem.",
      data: {
        user_id: user_data.user_id,
        email: user_data.email,
        device_id,
        logged_out_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error Logout:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = Logout;
