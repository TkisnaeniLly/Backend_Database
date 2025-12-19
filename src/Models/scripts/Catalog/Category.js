const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Category;
