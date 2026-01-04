const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function utilityAliases() {
  addAlias("response", path.join(__dirname, "Utils", "response.js"));
  addAlias(
    "registerSaveData",
    path.join(__dirname, "Auth", "registerSaveData.js")
  );
  addAlias(
    "validasiInputRegister",
    path.join(__dirname, "Auth", "validasiInputRegister.js")
  );
  addAlias(
    "sendEmailConfirmation",
    path.join(__dirname, "Auth", "sendEmailConfirmation.js")
  );
  addAlias(
    "generateLoginOtp",
    path.join(__dirname, "Auth", "generateLoginOtp.js")
  );
  addAlias(
    "sendLoginOtpEmail",
    path.join(__dirname, "Auth", "sendLoginOtpEmail.js")
  );
  addAlias(
    "validasiEditUser",
    path.join(__dirname, "Home", "validasiEditUser.js")
  );
}

module.exports = utilityAliases;
