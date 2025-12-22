// ... (Import sebelumnya tetap ada)

// New Imports
const Wishlist = require("./scripts/Catalog/Wishlist");
const Review = require("./scripts/Catalog/Review");
const PartnerCompany = require("./scripts/Partner/PartnerCompany");
const PaymentMethod = require("./scripts/Payment/PaymentMethod");
const ProductHistory = require("./scripts/Catalog/ProductHistory");

// ==================
// Tambahan Relasi
// ==================

// Wishlist (User <-> Product)
User.hasMany(Wishlist, { foreignKey: "user_id" });
Wishlist.belongsTo(User, { foreignKey: "user_id" });
Product.hasMany(Wishlist, { foreignKey: "product_id" });
Wishlist.belongsTo(Product, { foreignKey: "product_id" });

// Review (User <-> Product)
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });
Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

// Partner & Payment Method
PartnerCompany.hasMany(PaymentMethod, { foreignKey: "partner_id" });
PaymentMethod.belongsTo(PartnerCompany, { foreignKey: "partner_id" });

// Product History
Product.hasMany(ProductHistory, { foreignKey: "product_id" });
ProductHistory.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
  User,
  UserProfile,
  Product,
  Category,
  Brand,
  Inventory,
  Wishlist,
  Review,
  PartnerCompany,
  PaymentMethod,
  ProductHistory,
  // ... export lainnya
};
