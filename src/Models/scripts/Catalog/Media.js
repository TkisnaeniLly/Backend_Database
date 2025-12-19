const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media_type: {
      type: DataTypes.ENUM("image", "video"),
      defaultValue: "image",
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "media",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Media;
