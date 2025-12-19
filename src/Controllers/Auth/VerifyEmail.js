const crypto = require("crypto");
const response = require("response");
const { User, EmailVerification } = require("../../Models");

const VerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return response(res, {
        statusCode: 400,
        message: "Token verifikasi tidak ditemukan.",
        data: null,
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const verification = await EmailVerification.findOne({
      where: { token_hash: tokenHash },
    });

    if (!verification) {
      return response(res, {
        statusCode: 400,
        message: "Token verifikasi tidak valid.",
        data: null,
      });
    }

    if (verification.verified_at) {
      return response(res, {
        statusCode: 400,
        message: "Email sudah terverifikasi.",
        data: null,
      });
    }

    if (new Date() > verification.expired_at) {
      return response(res, {
        statusCode: 400,
        message: "Token verifikasi sudah kedaluwarsa.",
        data: null,
      });
    }
    const user = await User.findByPk(verification.user_id);

    if (!user) {
      return response(res, {
        statusCode: 404,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    user.status_akun = "active";
    await user.save();

    verification.verified_at = new Date();
    await verification.save();

    return response(res, {
      statusCode: 200,
      message: "Email berhasil diverifikasi. Akun Anda sudah aktif.",
      data: null,
    });
  } catch (error) {
    console.error("Error VerifyEmail Controller:", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = VerifyEmail;
