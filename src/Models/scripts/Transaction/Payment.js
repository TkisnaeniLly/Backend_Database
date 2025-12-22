const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    total_paid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    transaction_ref: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Payment;