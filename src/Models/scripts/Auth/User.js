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
      type: DataTypes.STRING(30),
      defaultValue: "user",
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
    status_akun: {
      type: DataTypes.ENUM("pending", "active", "suspended", "blocked"),
      defaultValue: "pending",
    },
    registered_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    // 🔥 TAMBAHKAN INI
    token_version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.beforeSave((user) => {
  user.updated_at = new Date();
});

module.exports = User;
