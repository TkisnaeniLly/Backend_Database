const { User } = require("../../Models");
const zxcvbn = require("zxcvbn");

const ValidasiInputRegister = async (datas) => {
  try {
    if (!datas.username || !datas.email || !datas.password) {
      return {
        success: false,
        message: "Username, email, dan password wajib diisi.",
      };
    }

    if (await User.findOne({ where: { username: datas.username } })) {
      return {
        success: false,
        message: "Username sudah terdaftar.",
      };
    }

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

    if (await User.findOne({ where: { email: datas.email } })) {
      return {
        success: false,
        message: "Email sudah digunakan.",
      };
    }

    if (
      datas.phone_number &&
      (await User.findOne({ where: { phone_number: datas.phone_number } }))
    ) {
      return {
        success: false,
        message: "Nomor telepon sudah digunakan.",
      };
    }

    if (datas.password.length < 8) {
      return {
        success: false,
        message: "Password minimal 8 karakter.",
      };
    }

    const passwordCheck = zxcvbn(datas.password, [
      datas.username,
      datas.email,
      datas.full_name,
    ]);

    /**
     * score:
     * 0 = sangat lemah
     * 1 = lemah
     * 2 = cukup
     * 3 = kuat
     * 4 = sangat kuat
     */
    if (passwordCheck.score < 3) {
      return {
        success: false,
        message:
          "Password terlalu lemah. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.",
      };
    }

    return {
      success: true,
      message: "Validasi berhasil.",
    };
  } catch (error) {
    console.error("Error Validasi Register:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat validasi.",
    };
  }
};

module.exports = ValidasiInputRegister;
