const response = require("response");
const registerSaveData = require("registerSaveData");
const validasiInputRegister = require("validasiInputRegister");
const sendEmailConfirmation = require("sendEmailConfirmation");

const Register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone_number,
      role,
      full_name,
      gender,
      birth_date,
      status_akun,
      registered_at,
    } = req.body;

    const datas = {
      username,
      password,
      email,
      phone_number,
      role,
      full_name,
      gender,
      birth_date,
      status_akun,
      registered_at,
    };
    const validasi = await validasiInputRegister(datas);
    if (!validasi.success) {
      return response(res, {
        statusCode: 400,
        message: validasi.message,
        data: null,
      });
    }

    const saveData = await registerSaveData(datas);
    if (!saveData.success) {
      return response(res, {
        statusCode: 400,
        message: "Gagal Mendaftar, silahkan coba lagi.",
        data: null,
      });
    }
    const sendEmail = await sendEmailConfirmation(saveData.user_id);
    if (!sendEmail) {
      return response(res, {
        statusCode: 400,
        message: "Gagal Mendaftar mail server error, silahkan coba lagi.",
        data: null,
      });
    }

    response(res, {
      statusCode: 200,
      message: "Berhasil Mendaftar, silahkan konfirmasi email anda.",
      data: null,
    });
  } catch (error) {
    console.error("Error Controller Register : ", error);
    response(res, {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = Register;
