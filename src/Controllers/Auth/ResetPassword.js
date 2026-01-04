const response = require("response");
const checkEmail = require("../../Libs/Auth/checkEmail");
const sendEmailReset = require("../../Libs/Auth/sendEmailReset");

const ResetPassword = async (req, res) => {
  try {
    // console.log("Reset Password Request Received");
    const { email } = req.body;
    if (!email) {
      return response(res, {
        statusCode: 400,
        message: "Email wajib diisi.",
        data: null,
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response(res, {
        statusCode: 400,
        message: "Format email tidak valid.",
        data: null,
      });
    }

    // TODO: Verifikasi apakah email terdaftar di database
    const isEmailValid = await checkEmail(email);
    // console.log("isEmailValid", isEmailValid);
    if (!isEmailValid) {
      return response(res, {
        statusCode: 400,
        message: "User tidak terdaftar.",
        data: null,
      });
    }
    // TODO: tambahkan logika untuk mengirim email reset password di sini
    const isEmailSent = await sendEmailReset(isEmailValid);
    if (!isEmailSent) {
      return response(res, {
        statusCode: 500,
        message: "Gagal mengirim email reset password.",
        data: null,
      });
    }

    return response(res, {
      statusCode: 200,
      message: "Permintaan reset password diterima.",
      data: null,
    });
  } catch (error) {
    console.error("Error Login Request OTP:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = ResetPassword;
