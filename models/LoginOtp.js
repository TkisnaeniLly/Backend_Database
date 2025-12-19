const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const LoginOtp = sequelize.define(
  "LoginOtp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'user_id' }
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "ID unik perangkat yang tersimpan di user_login_devices"
    },
    otp_code: {
      type: DataTypes.STRING(10), // Biasanya OTP pendek
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "login_otps",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = LoginOtp;
