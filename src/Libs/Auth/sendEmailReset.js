const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { EmailVerification, User, ResetPassword } = require("../../Models");
const nodemailer = require("nodemailer");

const sendEmailReset = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return false;

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    await EmailVerification.create({
      user_id: user.user_id,
      token_hash: tokenHash,
      expired_at: expiredAt,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user_id + token + otp to ResetPassword table
    await ResetPassword.create({
      user_id: user.user_id,
      token: token,
      otp_code: otp,
      expired_at: expiredAt,
    });

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.APP_URL_PRODUCTION
        : process.env.APP_URL;

    // TODO : bikin endpoint reset password, method put

    const verifyLink = `${baseUrl}/api/auth/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Reset Password Anda",
      html: `
        <h3>Halo ${user.full_name || user.username},</h3>
        <p>Silakan klik link dibawah untuk mengganti password anda:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>Link ini berlaku selama <b>5 menit</b>.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sendEmailReset:", error);
    return false;
  }
};

module.exports = sendEmailReset;
