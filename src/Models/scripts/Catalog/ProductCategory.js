const { DataTypes } = require("sequelize");
const sequelize = require("../../../Config/sequelizeConnect");

const ProductCategory = sequelize.define(
  "ProductCategory",
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "product_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["product_id", "category_id"],
      },
    ],
    hooks: {
      beforeCreate: async (pc, options) => {
        const ProductCategory = pc.constructor;
        const count = await ProductCategory.count({
          where: { product_id: pc.product_id },
          transaction: options.transaction,
        });
        if (count >= 5) {
          throw new Error("Product cannot have more than 5 categories");
        }
      },
      beforeBulkCreate: async (instances, options) => {
        const ProductCategory = instances[0] && instances[0].constructor;
        if (!ProductCategory) return;
        const map = {};
        for (const pc of instances) {
          map[pc.product_id] = (map[pc.product_id] || 0) + 1;
        }
        for (const pid of Object.keys(map)) {
          const existing = await ProductCategory.count({
            where: { product_id: pid },
            transaction: options.transaction,
          });
          if (existing + map[pid] > 5) {
            throw new Error(`Product ${pid} would exceed 5 categories`);
          }
        }
      },
    },
  }
);

module.exports = ProductCategory;
