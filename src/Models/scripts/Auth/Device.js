const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Device = sequelize.define(
    "Device",
    {
        device_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        device_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remember_me: {
            type: DataTypes.BOOLEAN,
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
        tableName: "device",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

module.exports = Device;