const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Variant = sequelize.define(
  "Variant",
  {
    variant_id: {
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
      allowNull: false, // Contoh: Warna, Ukuran
    },
    variant_value: {
      type: DataTypes.STRING(50),
      allowNull: false, // Contoh: Merah, XL
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
