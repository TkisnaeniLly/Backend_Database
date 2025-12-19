const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        console.warn("⛔ Authorization failed: User tidak terautentikasi");
        return res.status(401).json({
          statusCode: 401,
          message: "Unauthorized. Silakan login terlebih dahulu.",
          data: null,
        });
      }

      const userRole = req.user.role.toLowerCase();
      const hasAccess = allowedRoles
        .map((role) => role.toLowerCase())
        .includes(userRole);

      if (!hasAccess) {
        console.warn(
          `⛔ Authorization failed: Role '${userRole}' tidak memiliki akses`
        );
        return res.status(403).json({
          statusCode: 403,
          message: "Forbidden. Anda tidak memiliki akses ke resource ini.",
          data: {
            required_roles: allowedRoles,
            your_role: userRole,
          },
        });
      }

      console.log(`✅ Authorized: ${userRole} -> [${allowedRoles.join(", ")}]`);
      next();
    } catch (error) {
      console.error("❌ Authorization Error:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Terjadi kesalahan pada server.",
        data: process.env.NODE_ENV === "development" ? error.message : null,
      });
    }
  };
};

module.exports = authorizeRole;
