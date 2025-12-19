const crypto = require("crypto");
const bcrypt = require("bcrypt");
const UAParser = require("ua-parser-js");
const { User, UserLoginDevice, LoginOtp } = require("../../Models");
const response = require("response");
const sendLoginOtpEmail = require("sendLoginOtpEmail");
const generateLoginOtp = require("generateLoginOtp");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(res, {
        statusCode: 400,
        message: "Email dan password wajib diisi.",
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

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    let ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    if (ipAddress.startsWith("::ffff:")) {
      ipAddress = ipAddress.substring(7);
    }

    const userAgent = req.headers["user-agent"] || "unknown";

    const device_id = crypto
      .createHash("sha256")
      .update(`${ipAddress}-${userAgent}`)
      .digest("hex")
      .substring(0, 32);

    const browser = result.browser.name || "Unknown Browser";
    const browserVersion = result.browser.version || "";
    const os = result.os.name || "Unknown OS";
    const osVersion = result.os.version || "";
    const deviceType = result.device.type || "desktop";

    const device_name = `${browser} ${browserVersion} on ${os} ${osVersion} (${deviceType})`;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return response(res, {
        statusCode: 404,
        message: "Email atau password salah.",
        data: null,
      });
    }
    if (user.status_akun !== "active") {
      return response(res, {
        statusCode: 403,
        message: `Akun Anda berstatus ${user.status_akun}. Silakan hubungi administrator.`,
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response(res, {
        statusCode: 401,
        message: "Email atau password salah.",
        data: null,
      });
    }

    let device = await UserLoginDevice.findOne({
      where: {
        user_id: user.user_id,
        device_id,
      },
    });

    if (!device) {
      device = await UserLoginDevice.create({
        user_id: user.user_id,
        device_id,
        device_name,
        ip_address: ipAddress,
        user_agent: userAgent,
        browser,
        os,
        device_type: deviceType,
        is_verified: false,
      });
    } else {
      await device.update({
        device_name,
        ip_address: ipAddress,
        user_agent: userAgent,
        browser,
        os,
        device_type: deviceType,
      });
    }

    const otpResult = await generateLoginOtp();
    if (!otpResult.success) {
      return response(res, {
        statusCode: 500,
        message: otpResult.message,
        data: null,
      });
    }

    await LoginOtp.destroy({
      where: {
        user_id: user.user_id,
        device_id,
        is_used: false,
      },
    });

    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);
    await LoginOtp.create({
      user_id: user.user_id,
      device_id,
      otp_code: otpResult.otp,
      expired_at: expiredAt,
      is_used: false,
    });

    const emailResult = await sendLoginOtpEmail(user.email, otpResult.otp);
    if (!emailResult.success) {
      return response(res, {
        statusCode: 500,
        message: emailResult.message,
        data: null,
      });
    }

    return response(res, {
      statusCode: 200,
      message:
        "OTP login telah dikirim ke email Anda. Silakan cek inbox atau folder spam.",
      data: {
        email: user.email,
        device_id,
        device_name,
        expires_in: "5 menit",
      },
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

module.exports = Login;
