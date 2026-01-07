const response = require("response");
const { User } = require("../../Models");
const { Op } = require("sequelize");

const checkUserRegistered = async (req, res) => {
  try {
    const { email, username, phone_number } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const phoneRegex = /^\d{10,14}$/;

    // Ensure at least one field is provided
    if (!email && !username && !phone_number) {
      return response(res, {
        statusCode: 400,
        message: "Mohon sertakan email, username, atau nomor telepon.",
        data: null,
      });
    }

    // Check Email
    if (email) {
      if (!emailRegex.test(email)) {
        return response(res, {
          statusCode: 400,
          message: "Email tidak valid.",
          data: null,
        });
      }
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) {
        return response(res, {
          statusCode: 400,
          message: "Email sudah terdaftar.",
          data: null,
        });
      }
    }

    // Check Username
    if (username) {
      if (!usernameRegex.test(username)) {
        return response(res, {
          statusCode: 400,
          message: "Username tidak valid.",
          data: null,
        });
      }
      const usernameExist = await User.findOne({ where: { username } });
      if (usernameExist) {
        return response(res, {
          statusCode: 400,
          message: "Username sudah terdaftar.",
          data: null,
        });
      }
    }

    // Check Phone Number (Dual Format Check: 08... and 628...)
    if (phone_number) {
      if (!phoneRegex.test(phone_number)) {
        return response(res, {
          statusCode: 400,
          message: "Nomor telepon tidak valid (harus 10-14 digit).",
          data: null,
        });
      }

      // Generate both formats
      let phone0 = "";
      let phone62 = "";

      if (phone_number.startsWith("0")) {
        phone0 = phone_number;
        phone62 = "62" + phone_number.substring(1);
      } else if (phone_number.startsWith("62")) {
        phone62 = phone_number;
        phone0 = "0" + phone_number.substring(2);
      } else {
        // If it starts with neither (e.g. 812...), assume it needs prefixing or just check as is + standard variants if possible.
        // For safety, if it doesn't match standard patterns, strict check the input only,
        // OR assume it's just a number and we try to construct standard forms if valid.
        // Given regex validation passed \d{10,14}, we assume standard Indonesian format logic requested by user.
        // Fallback: use input as matching one of the forms if possible, or just exact match.
        // For this task, we focus on 08 vs 628 equivalence.
        phone0 = phone_number;
        phone62 = phone_number;
      }

      const phoneExist = await User.findOne({
        where: {
          phone_number: {
            [Op.or]: [phone0, phone62],
          },
        },
      });

      if (phoneExist) {
        return response(res, {
          statusCode: 400,
          message: "Nomor telepon sudah terdaftar.",
          data: null,
        });
      }
    }

    return response(res, {
      statusCode: 200,
      message: "Oke.",
      data: null,
    });
  } catch (error) {
    console.log("Error Check User Registered : ", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = checkUserRegistered;
