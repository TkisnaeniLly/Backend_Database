const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    origin_country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "brands",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Brand;
