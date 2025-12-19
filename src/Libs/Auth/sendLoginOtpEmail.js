require("dotenv").config();
const nodemailer = require("nodemailer");

const sendLoginOtpEmail = async (email, otp) => {
  try {
    if (!email || !otp) {
      throw new Error("Email dan OTP wajib diisi.");
    }
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Konfigurasi email belum diatur (SMTP_USER atau SMTP_PASS kosong)."
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Auth System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Kode OTP Login",
      text: `Kode OTP login kamu adalah: ${otp}. Berlaku 5 menit.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Kode OTP Login</h2>
          <p>Kode OTP login kamu adalah:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">Kode ini berlaku selama <strong>5 menit</strong>.</p>
          <p style="color: #999; font-size: 12px;">Jika kamu tidak meminta kode ini, abaikan email ini.</p>
        </div>
      `,
    });

    console.log("Email OTP berhasil dikirim ke:", email);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      message: "Email OTP berhasil dikirim.",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sendLoginOtpEmail:", error);

    let errorMessage = "Gagal mengirim email OTP.";

    if (error.code === "EAUTH") {
      errorMessage =
        "Autentikasi email gagal. Periksa SMTP_USER dan SMTP_PASS.";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Gagal terhubung ke server email.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: error.message,
    };
  }
};

module.exports = sendLoginOtpEmail;
