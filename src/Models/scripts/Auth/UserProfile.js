const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const UserProfile = sequelize.define(
  "UserProfile",
  {
    profile_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    avatar: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "user_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = UserProfile;
