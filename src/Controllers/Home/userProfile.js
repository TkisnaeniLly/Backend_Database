const { User, UserProfile } = require("../../Models");
const response = require("response");

const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Fetch User with UserProfile
    const user = await User.findByPk(user_id, {
      include: {
        model: UserProfile,
        attributes: ["address", "avatar"],
      },
    });

    // console.log("User ID : ", user_id);
    // console.log("Data User : ", user);

    if (!user) {
      return response(res, {
        statusCode: 404,
        message: "User tidak ditemukan.",
        data: null,
      });
    }

    const formattedUser = {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      full_name: user.full_name,
      gender: user.gender,
      birth_date: user.birth_date,
      status_akun: user.status_akun,
      registered_at: user.registered_at,
      last_login: user.last_login,
      address: user.UserProfile ? user.UserProfile.address : null,
      avatar: user.UserProfile ? user.UserProfile.avatar : null,
    };

    return response(res, {
      statusCode: 200,
      message: "User berhasil ditemukan.",
      data: formattedUser,
    });
  } catch (error) {
    console.error("Error Get User Profile:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = getUserProfile;
