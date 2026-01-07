const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const Wishlist = sequelize.define(
    "Wishlist",
    {
        Wishlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
    },
    {
        tableName: "wishlist",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Wishlist;
