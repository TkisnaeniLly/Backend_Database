const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const ResetPassword = sequelize.define(
    "ResetPassword",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expired_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "reset_token",
        timestamps: true,
    }
);

module.exports = ResetPassword;
