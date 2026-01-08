const { User } = require("../../Models");
const { Op } = require("sequelize");

const ValidasiEditUser = async (datas, userId) => {
  try {
    if (datas.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datas.email)) {
        return {
          success: false,
          message: "Format email tidak valid.",
        };
      }

      if (process.env.ALLOWED_DOMAIN_MAIL) {
        const emailDomain = datas.email.split("@")[1]?.toLowerCase();
        const allowedDomains = process.env.ALLOWED_DOMAIN_MAIL.split(",").map(
          (domain) => domain.trim().toLowerCase()
        );

        if (!allowedDomains.includes(emailDomain)) {
          return {
            success: false,
            message: `Email hanya boleh menggunakan domain: ${allowedDomains.join(
              ", "
            )}`,
          };
        }
      }

      const existingUserEmail = await User.findOne({
        where: {
          email: datas.email,
          user_id: { [Op.ne]: userId },
        },
      });

      if (existingUserEmail) {
        return {
          success: false,
          message: "Email sudah digunakan oleh pengguna lain.",
        };
      }
    }

    if (datas.username) {
      const existingUserUsername = await User.findOne({
        where: {
          username: datas.username,
          user_id: { [Op.ne]: userId },
        },
      });

      if (existingUserUsername) {
        return {
          success: false,
          message: "Username sudah digunakan oleh pengguna lain.",
        };
      }
    }

    if (datas.phone_number) {
      const existingUserPhone = await User.findOne({
        where: {
          phone_number: datas.phone_number,
          user_id: { [Op.ne]: userId },
        },
      });

      if (existingUserPhone) {
        return {
          success: false,
          message: "Nomor telepon sudah digunakan oleh pengguna lain.",
        };
      }
    }

    return {
      success: true,
      message: "Validasi berhasil.",
    };
  } catch (error) {
    console.error("Error Validasi Edit User:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat validasi.",
    };
  }
};

module.exports = ValidasiEditUser;
