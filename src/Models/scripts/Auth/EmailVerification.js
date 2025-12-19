const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const EmailVerification = sequelize.define(
  "EmailVerification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "email_verifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = EmailVerification;
