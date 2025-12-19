const bcrypt = require("bcrypt");
const { User } = require("../../Models/index");

const registerSaveData = async (datas) => {
  try {
    const hashedPassword = await bcrypt.hash(datas.password, 10);
    const proses = await User.create({
      username: datas.username,
      password: hashedPassword,
      email: datas.email,
      phone_number: datas.phone_number,
      role: datas.role,
      full_name: datas.full_name,
      gender: datas.gender,
      birth_date: datas.birth_date,
      status_akun: "pending",
    });

    console.log("Proses Register Save Data : ", proses);

    return {
      success: true,
      user_id: proses.user_id,
      message: "User berhasil didaftarkan.",
    };
  } catch (error) {
    console.error("Error Libs Auth Register Save Data : ", error);
    return {
      success: false,
      user_id: null,
      message: "Gagal menyimpan data user.",
    };
  }
};

module.exports = registerSaveData;
