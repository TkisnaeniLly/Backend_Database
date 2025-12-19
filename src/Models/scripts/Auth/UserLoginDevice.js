const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const UserLoginDevice = sequelize.define(
  "UserLoginDevice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    device_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_login_devices",
    timestamps: true,
  }
);

module.exports = UserLoginDevice;
