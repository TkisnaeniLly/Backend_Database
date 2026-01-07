const { User, UserProfile, sequelize } = require("../../Models");
const response = require("response");
const validasiEditUser = require("validasiEditUser");

const editUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const user_id = req.user.user_id;
    const data = req.body;

    // 1. Validasi Input
    const validasi = await validasiEditUser(data, user_id);
    if (!validasi.success) {
      await transaction.rollback();
      return response(res, {
        statusCode: 400,
        message: validasi.message,
        data: null,
      });
    }

    // 2. Update Data User
    const userDataToUpdate = {};
    if (data.username) userDataToUpdate.username = data.username;
    if (data.email) userDataToUpdate.email = data.email;
    if (data.phone_number) userDataToUpdate.phone_number = data.phone_number;
    if (data.full_name) userDataToUpdate.full_name = data.full_name;
    if (data.gender) userDataToUpdate.gender = data.gender;
    if (data.birth_date) userDataToUpdate.birth_date = data.birth_date;

    // Hanya update jika ada data yang dikirim
    if (Object.keys(userDataToUpdate).length > 0) {
      await User.update(userDataToUpdate, {
        where: { user_id },
        transaction,
      });
    }

    // 3. Update Data UserProfile (Address & Avatar)
    const userProfileDataToUpdate = {};
    if (data.address) userProfileDataToUpdate.address = data.address;

    // Handle Avatar Upload
    if (req.file) {
      // Simpan path relative atau URL full, tergantung kebutuhan frontend.
      // Di sini simpan path relative dari root static folder
      // e.g., /images/users/filename.jpg
      const avatarPath = `/images/users/${req.file.filename}`;
      userProfileDataToUpdate.avatar = avatarPath;
    } else if (data.avatar) {
      // Jika dikirim string (misal null atau url external jika supported)
      userProfileDataToUpdate.avatar = data.avatar;
    }

    if (Object.keys(userProfileDataToUpdate).length > 0) {
      // Cek apakah UserProfile sudah ada
      const userProfile = await UserProfile.findOne({
        where: { user_id },
        transaction,
      });

      if (userProfile) {
        // Update jika ada
        await UserProfile.update(userProfileDataToUpdate, {
          where: { user_id },
          transaction,
        });
      } else {
        // Create jika belum ada
        await UserProfile.create(
          {
            user_id,
            ...userProfileDataToUpdate,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // 4. Fetch Updated Data untuk response
    const updatedUser = await User.findByPk(user_id, {
      include: {
        model: UserProfile,
        attributes: ["address", "avatar"],
      },
    });

    const formattedUser = {
      username: updatedUser.username,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      role: updatedUser.role,
      full_name: updatedUser.full_name,
      gender: updatedUser.gender,
      birth_date: updatedUser.birth_date,
      status_akun: updatedUser.status_akun,
      registered_at: updatedUser.registered_at,
      last_login: updatedUser.last_login,
      address: updatedUser.UserProfile ? updatedUser.UserProfile.address : null,
      avatar: updatedUser.UserProfile ? updatedUser.UserProfile.avatar : null,
    };

    return response(res, {
      statusCode: 200,
      message: "Profil berhasil diperbarui.",
      data: formattedUser,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error Edit User:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = editUser;
