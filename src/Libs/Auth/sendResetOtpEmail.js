const nodemailer = require("nodemailer");
const { User } = require("../../Models");

const sendResetOtpEmail = async (userId, otp) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) return false;

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
      subject: "Kode OTP Reset Password",
      html: `
        <h3>Halo ${user.full_name || user.username},</h3>
        <p>Berikut adalah kode OTP untuk mereset password Anda:</p>
        <h2>${otp}</h2>
        <p>Kode ini berlaku selama <b>5 menit</b>.</p>
        <p>Jangan berikan kode ini kepada siapapun.</p>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sendResetOtpEmail:", error);
    return false;
  }
};

module.exports = sendResetOtpEmail;
