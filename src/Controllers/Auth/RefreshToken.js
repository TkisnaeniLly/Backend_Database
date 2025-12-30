const jwt = require("jsonwebtoken");
const { User, UserLoginDevice } = require("../../Models");
const response = require("response");

const RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return response(res, {
        statusCode: 401,
        message: "Refresh token tidak ditemukan. Silakan login kembali.",
        data: null,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET tidak ditemukan");
      return res.status(500).json({
        statusCode: 500,
        message: "Konfigurasi server belum lengkap.",
        data: null,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie("refreshToken");
      return response(res, {
        statusCode: 403,
        message: "Refresh token tidak valid atau kadaluarsa.",
        data: null,
      });
    }

    // Periksa apakah ini benar-benar refresh token
    if (decoded.type !== "refresh") {
      return response(res, {
        statusCode: 403,
        message: "Token tidak valid.",
        data: null,
      });
    }

    const user = await User.findByPk(decoded.user_id, {
      attributes: [
        "user_id",
        "email",
        "role",
        "token_version",
        "status_akun",
        "full_name",
      ],
    });

    if (!user) {
      res.clearCookie("refreshToken");
      return response(res, {
        statusCode: 401,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    // Cek Token Version
    if (decoded.token_version !== user.token_version) {
      res.clearCookie("refreshToken");
      return response(res, {
        statusCode: 403,
        message: "Sesi tidak valid. Silakan login kembali.",
        data: null,
      });
    }

    // Cek Status Akun
    if (user.status_akun !== "active") {
      res.clearCookie("refreshToken");
      return response(res, {
        statusCode: 403,
        message: `Akun Anda berstatus ${user.status_akun}.`,
        data: null,
      });
    }

    // Validasi Device
    const device = await UserLoginDevice.findOne({
      where: {
        user_id: user.user_id,
        device_id: decoded.device_id,
        is_verified: true,
      },
    });

    if (!device) {
      res.clearCookie("refreshToken");
      return response(res, {
        statusCode: 401,
        message: "Perangkat tidak dikenali. Silakan login kembali.",
        data: null,
      });
    }

    // Issue New Access Token
    const newAccessToken = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        token_version: user.token_version,
        device_id: decoded.device_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    console.log(`✅ Refreshed Access Token for user ${user.email}`);

    return response(res, {
      statusCode: 200,
      message: "Access token diperbarui.",
      data: {
        token: newAccessToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        expires_in: "10 menit",
      },
    });
  } catch (error) {
    console.error("❌ Refresh Token Error:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = RefreshToken;
