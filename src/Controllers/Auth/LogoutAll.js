const { UserLoginDevice, LoginOtp } = require("../../Models");
const response = require("response");

const LogoutAll = async (req, res) => {
  try {
    const user = req.user;

    const updatedDevices = await UserLoginDevice.update(
      { is_verified: false },
      {
        where: {
          user_id: user.user_id,
        },
      }
    );

    await LoginOtp.destroy({
      where: {
        user_id: user.user_id,
        is_used: false,
      },
    });

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log(
      `✅ Logout dari semua device: user_id=${user.user_id}, total_devices=${updatedDevices[0]}`
    );

    return response(res, {
      statusCode: 200,
      message: "Berhasil logout dari semua device.",
      data: {
        user_id: user.user_id,
        email: user.email,
        total_devices_logged_out: updatedDevices[0],
        logged_out_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Error Logout All:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = LogoutAll;
