const jwt = require("jsonwebtoken");
const { LoginOtp, User, UserLoginDevice, Device } = require("../../Models");
const response = require("response");

const VerifyLoginOtp = async (req, res) => {
  try {
    const { email, device_id, otp } = req.body;

    if (!email || !device_id || !otp) {
      return response(res, {
        statusCode: 400,
        message: "Email, device_id, dan OTP wajib diisi.",
        data: null,
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return response(res, {
        statusCode: 400,
        message: "Format OTP tidak valid.",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response(res, {
        statusCode: 404,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    if (user.status_akun !== "active") {
      return response(res, {
        statusCode: 403,
        message: `Akun Anda ${user.status_akun}.`,
        data: null,
      });
    }

    const otpData = await LoginOtp.findOne({
      where: {
        user_id: user.user_id,
        device_id,
        otp_code: otp,
        is_used: false,
      },
    });

    if (!otpData) {
      return response(res, {
        statusCode: 400,
        message: "OTP tidak valid.",
        data: null,
      });
    }

    if (otpData.expired_at < new Date()) {
      return response(res, {
        statusCode: 400,
        message: "OTP sudah kadaluarsa.",
        data: null,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET tidak ditemukan di environment variables");
      return response(res, {
        statusCode: 500,
        message: "Konfigurasi server belum lengkap.",
        data: null,
      });
    }

    await otpData.update({ is_used: true });
    const rememberMe = req.body.remember_me || false;
    await UserLoginDevice.update(
      {
        is_verified: rememberMe,
        last_login_at: new Date(),
      },
      {
        where: {
          user_id: user.user_id,
          device_id,
        },
      }
    );

    await user.update({ last_login: new Date() });

    const accessToken = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        token_version: user.token_version,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const refreshTokenExpiry = rememberMe ? "30d" : "1d";

    const refreshToken = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        token_version: user.token_version,
        device_id: device_id,
        type: "refresh",
      },
      process.env.JWT_SECRET,
      { expiresIn: refreshTokenExpiry }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    return response(res, {
      statusCode: 200,
      message: "Login berhasil.",
      data: {
        token: accessToken,
        refreshToken: refreshToken,
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
    console.error("Error Verify Login OTP:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = VerifyLoginOtp;
