const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const PartnerCompany = sequelize.define(
  "PartnerCompany",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("LOGISTICS", "PAYMENT", "BRAND", "MARKETING"),
      allowNull: false,
    },
  },
  {
    tableName: "partner_companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PartnerCompany;
