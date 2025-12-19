const { UserLoginDevice } = require("../../Models");
const response = require("response");

const GetUserDevices = async (req, res) => {
  try {
    const user = req.user;

    const devices = await UserLoginDevice.findAll({
      where: {
        user_id: user.user_id,
      },
      attributes: [
        "id",
        "device_id",
        "device_name",
        "ip_address",
        "browser",
        "os",
        "device_type",
        "is_verified",
        "last_login_at",
        "createdAt",
        "updatedAt",
      ],
      order: [["last_login_at", "DESC"]],
    });

    const activeDevices = devices.filter((d) => d.is_verified);
    const inactiveDevices = devices.filter((d) => !d.is_verified);

    return response(res, {
      statusCode: 200,
      message: "Berhasil mengambil daftar device.",
      data: {
        total_devices: devices.length,
        active_devices: activeDevices.length,
        inactive_devices: inactiveDevices.length,
        devices: devices.map((device) => ({
          id: device.id,
          device_id: device.device_id,
          device_name: device.device_name,
          ip_address: device.ip_address,
          browser: device.browser,
          os: device.os,
          device_type: device.device_type,
          is_verified: device.is_verified,
          status: device.is_verified ? "active" : "inactive",
          last_login_at: device.last_login_at,
          first_login_at: device.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error Get User Devices:", error);
    return response(res, {
      statusCode: 500,
      message: "Terjadi kesalahan pada server.",
      data: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = GetUserDevices;
