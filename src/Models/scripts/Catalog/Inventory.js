const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Inventory = sequelize.define(
  "Inventory",
  {
    inventory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Berdasarkan relasi Lokasi Operasional di overview
    },
    stock_qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stock_minimum: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stock_status: {
      type: DataTypes.ENUM("AVAILABLE", "LOW", "OUT"),
      defaultValue: "AVAILABLE",
    },
  },
  {
    tableName: "inventories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "last_updated", // Sesuai dengan penamaan di dokumen overview
  }
);

module.exports = Inventory;
