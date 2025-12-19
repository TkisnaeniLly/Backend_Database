const jwt = require("jsonwebtoken");
const { User, UserLoginDevice } = require("../Models");
const crypto = require("crypto");

const authenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies.authToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("⛔ Akses ditolak: tidak ada token");
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized. Token tidak ditemukan.",
        data: null,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET tidak ditemukan");
      return res.status(500).json({
        statusCode: 500,
        message: "Konfigurasi server belum lengkap.",
        data: null,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Decoded token:", decoded);
    } catch (err) {
      console.warn("⛔ Token invalid / expired:", err.message);
      res.clearCookie("authToken");
      return res.status(401).json({
        statusCode: 401,
        message:
          err.name === "TokenExpiredError"
            ? "Token telah kadaluarsa. Silakan login kembali."
            : "Token tidak valid.",
        data: null,
      });
    }

    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "email", "role", "token_version", "status_akun"],
    });

    if (!user) {
      console.warn("⛔ User tidak ditemukan");
      res.clearCookie("authToken");
      return res.status(401).json({
        statusCode: 401,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    console.log("🔍 User from DB:", {
      user_id: user.user_id,
      email: user.email,
      token_version: user.token_version,
      status_akun: user.status_akun,
    });

    console.log("🔍 Comparing versions:", {
      decoded_version: decoded.token_version,
      db_version: user.token_version,
      match: decoded.token_version === user.token_version,
    });

    if (decoded.token_version !== user.token_version) {
      console.warn(
        `⛔ Token version mismatch: token=${decoded.token_version}, db=${user.token_version}`
      );
      res.clearCookie("authToken");
      return res.status(401).json({
        statusCode: 401,
        message: "Token tidak valid. Silakan login kembali.",
        data: null,
      });
    }

    if (user.status_akun !== "active") {
      res.clearCookie("authToken");
      return res.status(403).json({
        statusCode: 403,
        message: `Akun Anda berstatus ${user.status_akun}.`,
        data: null,
      });
    }

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

    console.log("🔍 Device check:", { device_id });

    const device = await UserLoginDevice.findOne({
      where: {
        user_id: user.user_id,
        device_id: device_id,
        is_verified: true,
      },
    });

    console.log("🔍 Device found:", device ? "YES" : "NO");

    if (!device) {
      console.warn(
        `⛔ Device tidak terverifikasi: user_id=${user.user_id}, device_id=${device_id}`
      );
      res.clearCookie("authToken");
      return res.status(401).json({
        statusCode: 401,
        message: "Sesi Anda telah berakhir. Silakan login kembali.",
        data: null,
      });
    }

    req.user = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      device_id: device_id,
    };

    console.log("✅ Authenticated:", req.user);
    next();
  } catch (error) {
    console.error("❌ Middleware Auth Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = authenticated;
