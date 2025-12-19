const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Variant = sequelize.define(
  "Variant",
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
    variant_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    variant_value: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "variants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Variant;
