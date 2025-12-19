const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
    },
    role: {
      type: DataTypes.ENUM("customer", "admin"), // Sesuai dokumen Overview
      defaultValue: "customer",
    },
    full_name: {
      type: DataTypes.STRING(100),
    },
    gender: {
      type: DataTypes.ENUM("L", "P"),
    },
    birth_date: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM("aktif", "nonaktif", "pending", "suspended"), // Penyesuaian dokumen
      defaultValue: "pending",
    },
    token_version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    registered_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: true, // Mengaktifkan createdAt & updatedAt otomatis
    createdAt: "registered_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
