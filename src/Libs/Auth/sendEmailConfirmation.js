const crypto = require("crypto");
const { EmailVerification, User } = require("../../Models");
const nodemailer = require("nodemailer");

const sendEmailConfirmation = async (userId) => {
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

    const verifyLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;
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
      subject: "Konfirmasi Email Anda",
      html: `
        <h3>Halo ${user.full_name || user.username},</h3>
        <p>Silakan klik link di bawah ini untuk mengaktifkan akun <br><i>E-Commerce TI 3A</i></br> Anda:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>Link ini berlaku selama <b>5 menit</b>.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error SendEmailConfirmation:", error);
    return false;
  }
};

module.exports = sendEmailConfirmation;
