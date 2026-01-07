const response = require("response");
const { ResetPassword, User } = require("../../Models");
const sendResetOtpEmail = require("../../Libs/Auth/sendResetOtpEmail");

const RequestResetOtp = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return response(res, {
        statusCode: 400,
        message: "Token diperlukan.",
        data: null,
      });
    }

    // Find ResetPassword entry by token
    const resetData = await ResetPassword.findOne({
      where: {
        token: token,
        is_used: false,
      },
    });

    if (!resetData) {
      return response(res, {
        statusCode: 404,
        message: "Token tidak valid atau sudah kadaluarsa.",
        data: null,
      });
    }

    if (new Date() > resetData.expired_at) {
      return response(res, {
        statusCode: 400,
        message:
          "Sesi reset password telah berakhir. Silakan minta reset password ulang.",
        data: null,
      });
    }

    // Generate new OTP or resend existing?
    // User flow says: "user meminta otp ... token ... validasi pada tabel".
    // Since sendEmailReset already created an OTP, we can verify if we should send THAT one or generate new.
    // If we generate new, we must update the DB.
    // Let's generate a NEW one to be safe and ensure freshness, or use existing if still valid.
    // Simplifying: generate new OTP and update.

    // NOTE: If we use existing 'otp_code' from DB (generated at Step 1), it saves writes.
    // However, usually OTP is generated ON DEMAND. But checkEmail->sendEmailReset created it.
    // Let's use the EXISTING one to match the 'sendEmailReset' logic where it was pre-generated.
    // But we must send it.

    const sent = await sendResetOtpEmail(resetData.user_id, resetData.otp_code);

    if (!sent) {
      return response(res, {
        statusCode: 500,
        message: "Gagal mengirim email OTP.",
        data: null,
      });
    }

    return response(res, {
      statusCode: 200,
      message: "Kode OTP telah dikirim ke email Anda.",
      data: null,
    });
  } catch (error) {
    console.error("Error RequestResetOtp:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = RequestResetOtp;
