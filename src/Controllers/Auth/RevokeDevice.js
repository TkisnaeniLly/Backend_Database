const { UserLoginDevice, LoginOtp } = require("../../Models");
const response = require("response");

const RevokeDevice = async (req, res) => {
  try {
    const user = req.user;
    const { device_id } = req.params;

    if (!device_id) {
      return response(res, {
        statusCode: 400,
        message: "Device ID wajib diisi.",
        data: null,
      });
    }

    const device = await UserLoginDevice.findOne({
      where: {
        user_id: user.user_id,
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
    await device.update({
      is_verified: false,
    });

    await LoginOtp.destroy({
      where: {
        user_id: user.user_id,
        device_id,
        is_used: false,
      },
    });

    console.log(
      `✅ Device revoked: user_id=${user.user_id}, device_id=${device_id}`
    );

    return response(res, {
      statusCode: 200,
      message: "Device berhasil direvoke. Akses dari device ini telah dicabut.",
      data: {
        device_id: device.device_id,
        device_name: device.device_name,
        revoked_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error Revoke Device:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = RevokeDevice;
