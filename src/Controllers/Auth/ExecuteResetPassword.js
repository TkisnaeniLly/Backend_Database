const response = require("response");
const bcrypt = require("bcrypt");
const { ResetPassword, User } = require("../../Models");

const ExecuteResetPassword = async (req, res) => {
  try {
    const { token, otp, password, confirmPassword } = req.body;

    if (!token || !otp || !password || !confirmPassword) {
      return response(res, {
        statusCode: 400,
        message: "Semua field harus diisi.",
        data: null,
      });
    }

    if (password !== confirmPassword) {
      return response(res, {
        statusCode: 400,
        message: "Konfirmasi password tidak sesuai.",
        data: null,
      });
    }

    if (password.length < 6) {
      return response(res, {
        statusCode: 400,
        message: "Password minimal 6 karakter.",
        data: null,
      });
    }

    const resetData = await ResetPassword.findOne({
      where: {
        token: token,
        otp_code: otp,
        is_used: false,
      },
    });

    if (!resetData) {
      return response(res, {
        statusCode: 400,
        message: "Token atau OTP tidak valid.",
        data: null,
      });
    }

    if (new Date() > resetData.expired_at) {
      return response(res, {
        statusCode: 400,
        message: "Kode OTP/Token sudah kadaluarsa.",
        data: null,
      });
    }

    const user = await User.findByPk(resetData.user_id);
    if (!user) {
      return response(res, {
        statusCode: 404,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await user.update({ password: hashedPassword });

    await resetData.destroy();

    return response(res, {
      statusCode: 200,
      message: "Password berhasil direset. Silakan login dengan password baru.",
      data: null,
    });
  } catch (error) {
    console.error("Error ExecuteResetPassword:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = ExecuteResetPassword;
