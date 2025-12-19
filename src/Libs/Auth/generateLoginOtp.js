const generateLoginOtp = async () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      success: true,
      message: "Berhasil generate OTP.",
      otp: otp,
    };
  } catch (error) {
    console.error("Error generateLoginOtp : ", error);
    return {
      success: false,
      message: "Gagal generate OTP.",
      otp: null,
    };
  }
};

module.exports = generateLoginOtp;
