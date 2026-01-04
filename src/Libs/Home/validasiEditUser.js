const { User } = require("../../Models");
const { Op } = require("sequelize");

const ValidasiEditUser = async (datas, userId) => {
  try {
    // 1. Cek User Existence (Optional but good practice if called independently, though controller usually checks)
    // We assume controller passes valid userId or checks it.

    // 2. Validate Email Format if provided
    if (datas.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(datas.email)) {
        return {
          success: false,
          message: "Format email tidak valid.",
        };
      }

      // 3. Validate Allowed Domain
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

      // 4. Validate Email Uniqueness (excluding current user)
      const existingUserEmail = await User.findOne({
        where: {
          email: datas.email,
          user_id: { [Op.ne]: userId }, // Exclude current user
        },
      });

      if (existingUserEmail) {
        return {
          success: false,
          message: "Email sudah digunakan oleh pengguna lain.",
        };
      }
    }

    // 5. Validate Username Uniqueness if provided
    if (datas.username) {
      const existingUserUsername = await User.findOne({
        where: {
          username: datas.username,
          user_id: { [Op.ne]: userId }, // Exclude current user
        },
      });

      if (existingUserUsername) {
        return {
          success: false,
          message: "Username sudah digunakan oleh pengguna lain.",
        };
      }
    }

    // 6. Validate Phone Number Uniqueness if provided
    if (datas.phone_number) {
      const existingUserPhone = await User.findOne({
        where: {
          phone_number: datas.phone_number,
          user_id: { [Op.ne]: userId }, // Exclude current user
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
