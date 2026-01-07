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

    // Password strength validation (Simple: min 6 chars)
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

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update User Password
    await user.update({ password: hashedPassword });

    // Mark Reset Token as used or Delete
    // Prompt says: "hapus data user pada reset_password"
    await resetData.destroy(); // Or .update({ is_used: true }) if you want to keep history, but prompt says "hapus".

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
